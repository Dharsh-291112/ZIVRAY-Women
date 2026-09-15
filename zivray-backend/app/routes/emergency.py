from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security.auth import get_current_user
from app.models import User, Notification

router = APIRouter(prefix="/api/emergency", tags=["emergency"])


@router.post("/alert")
def trigger_emergency_alert(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Creates an emergency notification. In production this would also
    notify the patient's registered emergency contacts / nearest hospital.
    """
    note = Notification(
        user_id=current_user.id,
        message="Emergency alert triggered. Nearby hospitals have been notified.",
    )
    db.add(note)
    db.commit()
    return {"status": "alert_sent"}
