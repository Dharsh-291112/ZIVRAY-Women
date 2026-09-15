from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.security.auth import get_current_user
from app.models import User, UserRole
from app.schemas import AppointmentOut, AppointmentCreate
from app.services.appointment_service import (
    list_appointments_for_patient,
    list_appointments_for_doctor,
    create_appointment,
    enrich_appointment,
)

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.get("/", response_model=List[AppointmentOut])
def get_appointments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.doctor:
        rows = list_appointments_for_doctor(db, current_user.id)
    else:
        rows = list_appointments_for_patient(db, current_user.id)
    return [enrich_appointment(db, r) for r in rows]


@router.post("/", response_model=AppointmentOut)
def book_appointment(
    payload: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    appt = create_appointment(db, current_user.id, payload)
    return enrich_appointment(db, appt)
