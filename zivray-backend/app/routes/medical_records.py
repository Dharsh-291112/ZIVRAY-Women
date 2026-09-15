from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.security.auth import get_current_user
from app.models import User
from app.schemas import MedicalRecordOut, MedicalRecordCreate
from app.services.medical_service import list_records, create_record, list_analytics

router = APIRouter(prefix="/api/medical-records", tags=["medical_records"])


@router.get("/", response_model=List[MedicalRecordOut])
def get_records(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_records(db, current_user.id)


@router.post("/", response_model=MedicalRecordOut)
def upload_record(
    payload: MedicalRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_record(db, current_user.id, payload)


@router.get("/analytics")
def get_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = list_analytics(db, current_user.id)
    return [
        {"metric_name": r.metric_name, "metric_value": r.metric_value, "recorded_at": r.recorded_at}
        for r in rows
    ]
