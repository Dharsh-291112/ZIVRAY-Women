from sqlalchemy.orm import Session

from app.models import MedicalRecord, HealthAnalytic
from app.schemas import MedicalRecordCreate


def list_records(db: Session, patient_id: str):
    return (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == patient_id)
        .order_by(MedicalRecord.uploaded_at.desc())
        .all()
    )


def create_record(db: Session, patient_id: str, payload: MedicalRecordCreate) -> MedicalRecord:
    record = MedicalRecord(
        patient_id=patient_id,
        record_type=payload.record_type,
        title=payload.title,
        file_url=payload.file_url,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_analytics(db: Session, patient_id: str):
    return (
        db.query(HealthAnalytic)
        .filter(HealthAnalytic.patient_id == patient_id)
        .order_by(HealthAnalytic.recorded_at.asc())
        .all()
    )
