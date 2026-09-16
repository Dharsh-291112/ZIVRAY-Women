from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security.auth import get_current_user
from app.services.face_analysis_service import build_screening_result, write_scan_ledger

router = APIRouter(prefix="/api/face-analysis", tags=["derma_test"])
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 10 * 1024 * 1024


@router.post("/scan")
async def scan_face(
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, or WebP image")

    image_bytes = await image.read()
    if not image_bytes or len(image_bytes) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Image must be smaller than 10 MB")

    result = build_screening_result(image_bytes)
    write_scan_ledger(db, current_user.id, image_bytes, result)
    db.commit()
    return result