from datetime import datetime, time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security.auth import get_current_user
from app.models import User
from app.schemas import UserOut
from app.services.appointment_service import get_next_and_last_appointment, enrich_appointment

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


def _greeting_for_now() -> str:
    hour = datetime.now().hour
    if 5 <= hour < 12:
        return "Good morning"
    if 12 <= hour < 17:
        return "Good afternoon"
    if 17 <= hour < 21:
        return "Good evening"
    return "Good night"


@router.get("/me/home-summary")
def home_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    next_appt, last_appt = get_next_and_last_appointment(db, current_user.id)
    return {
        "greeting": _greeting_for_now(),
        "full_name": current_user.full_name,
        "next_appointment": enrich_appointment(db, next_appt) if next_appt else None,
        "last_appointment": enrich_appointment(db, last_appt) if last_appt else None,
    }
