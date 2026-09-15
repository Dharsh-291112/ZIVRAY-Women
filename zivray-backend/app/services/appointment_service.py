from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models import Appointment, User
from app.schemas import AppointmentCreate


def list_appointments_for_patient(db: Session, patient_id: str):
    return (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient_id)
        .order_by(Appointment.scheduled_at.asc())
        .all()
    )


def list_appointments_for_doctor(db: Session, doctor_id: str):
    return (
        db.query(Appointment)
        .filter(Appointment.doctor_id == doctor_id)
        .order_by(Appointment.scheduled_at.asc())
        .all()
    )


def get_next_and_last_appointment(db: Session, patient_id: str):
    now = datetime.utcnow()
    next_appt = (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient_id, Appointment.scheduled_at >= now)
        .order_by(Appointment.scheduled_at.asc())
        .first()
    )
    last_appt = (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient_id, Appointment.scheduled_at < now)
        .order_by(Appointment.scheduled_at.desc())
        .first()
    )
    return next_appt, last_appt


def create_appointment(db: Session, patient_id: str, payload: AppointmentCreate) -> Appointment:
    appt = Appointment(
        patient_id=patient_id,
        doctor_id=payload.doctor_id,
        scheduled_at=payload.scheduled_at,
        mode=payload.mode,
        notes=payload.notes,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt


def enrich_appointment(db: Session, appt: Appointment) -> dict:
    doctor = db.query(User).filter(User.id == appt.doctor_id).first()
    patient = db.query(User).filter(User.id == appt.patient_id).first()
    return {
        "id": appt.id,
        "patient_id": appt.patient_id,
        "doctor_id": appt.doctor_id,
        "scheduled_at": appt.scheduled_at,
        "status": appt.status,
        "mode": appt.mode,
        "notes": appt.notes,
        "doctor_name": doctor.full_name if doctor else None,
        "patient_name": patient.full_name if patient else None,
    }
