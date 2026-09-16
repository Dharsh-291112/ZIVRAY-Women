import shutil
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.security.auth import get_current_user
from app.models import CycleEvent, HealthAnalytic, MedicalRecord, User
from app.schemas import CycleEventCreate, CycleEventOut, HealthAnalyticCreate, HealthAnalyticOut, MedicalRecordOut, MedicalRecordCreate
from app.services.medical_service import list_records, create_record, list_analytics

router = APIRouter(prefix="/api/medical-records", tags=["medical_records"])
UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"}


@router.get("/", response_model=List[MedicalRecordOut])
def get_records(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_records(db, current_user.id)


@router.get("/{record_id}/file")
def download_record_file(
    record_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.id == record_id, MedicalRecord.patient_id == current_user.id)
        .first()
    )
    if not record or not record.file_url:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = UPLOAD_DIR / Path(record.file_url).name
    if not file_path.is_file():
        raise HTTPException(status_code=404, detail="Document file not found")
    return FileResponse(file_path, filename=file_path.name)


@router.post("/", response_model=MedicalRecordOut)
def upload_record(
    record_type: str = Form(...),
    title: str = Form(...),
    file: UploadFile | None = File(None),
    file_url: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    saved_file_url = file_url
    if file and file.filename:
        extension = Path(file.filename).suffix.lower()
        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Unsupported document type")

        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        stored_name = f"{uuid4().hex}{extension}"
        destination = UPLOAD_DIR / stored_name
        with destination.open("wb") as output:
            shutil.copyfileobj(file.file, output)
        saved_file_url = f"/uploads/{stored_name}"

    payload = MedicalRecordCreate(
        record_type=record_type,
        title=title,
        file_url=saved_file_url,
    )
    return create_record(db, current_user.id, payload)


@router.get("/analytics")
def get_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = list_analytics(db, current_user.id)
    return [
        {"metric_name": r.metric_name, "metric_value": r.metric_value, "recorded_at": r.recorded_at}
        for r in rows
    ]


@router.post("/analytics", response_model=HealthAnalyticOut)
def add_analytic(
    payload: HealthAnalyticCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_metrics = {"Hemoglobin", "Sugar", "Heart Rate"}
    if payload.metric_name not in allowed_metrics:
        raise HTTPException(status_code=400, detail="Unsupported health metric")
    analytic = HealthAnalytic(
        patient_id=current_user.id,
        metric_name=payload.metric_name,
        metric_value=payload.metric_value,
        recorded_at=payload.recorded_at or datetime.utcnow(),
    )
    db.add(analytic)
    db.commit()
    db.refresh(analytic)
    return analytic


@router.get("/cycle", response_model=List[CycleEventOut])
def get_cycle_events(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(CycleEvent)
        .filter(CycleEvent.patient_id == current_user.id)
        .order_by(CycleEvent.event_date.asc())
        .all()
    )


@router.post("/cycle", response_model=CycleEventOut)
def add_cycle_event(
    payload: CycleEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.event_type not in {"period", "fertile_window", "pregnancy"}:
        raise HTTPException(status_code=400, detail="Unsupported cycle event type")
    event = CycleEvent(patient_id=current_user.id, **payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event
