"""Privacy-preserving dermatology screening helpers.

The scorer is deliberately a deterministic MOCK. A trained regional model can
replace mock_score_image without changing the route or frontend contract.
"""
import hashlib
import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.models import FaceAnalysisLedger

METRICS = (
    "Acne",
    "Pigmentation",
    "Redness/Inflammation",
    "Dark circles",
    "Wrinkles & fine lines",
    "Pores",
    "Skin texture",
)


def mock_score_image(image_bytes: bytes) -> dict[str, int]:
    """Return stable demo scores derived from the image bytes, not diagnosis."""
    digest = hashlib.sha256(image_bytes).digest()
    return {
        metric: 45 + (digest[index] % 56)
        for index, metric in enumerate(METRICS)
    }


def build_screening_result(image_bytes: bytes) -> dict:
    scores = mock_score_image(image_bytes)
    lowest = sorted(scores.items(), key=lambda item: item[1])[:2]
    healthy = all(score >= 80 for score in scores.values())

    if healthy:
        specialty = "General Physician"
        summary = "Screening patterns look broadly within a healthy range. Consult a general physician if you have concerns."
    else:
        specialty = "Dermatologist"
        concerns = " and ".join(metric.lower() for metric, _ in lowest)
        summary = (
            f"Screening pattern associated with {concerns} — consult a dermatologist to confirm. "
            "This is not a diagnosis."
        )

    return {
        "scores": scores,
        "overall": round(sum(scores.values()) / len(scores)),
        "summary": summary,
        "recommended_specialty": specialty,
    }


def write_scan_ledger(db: Session, user_id: str, image_bytes: bytes, result: dict) -> None:
    """Append a tamper-evident hash-chain entry without retaining the image."""
    previous = (
        db.query(FaceAnalysisLedger)
        .order_by(FaceAnalysisLedger.created_at.desc())
        .first()
    )
    previous_hash = previous.entry_hash if previous else "0" * 64
    payload = {
        "event": "FACE_SCAN_COMPLETED",
        "user_id": user_id,
        "image_hash": hashlib.sha256(image_bytes).hexdigest(),
        "scores": result["scores"],
        "overall": result["overall"],
    }
    payload_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    entry_hash = hashlib.sha256(
        f"{previous_hash}:{payload_hash}:{datetime.utcnow().isoformat()}".encode()
    ).hexdigest()
    db.add(FaceAnalysisLedger(
        user_id=user_id,
        event_type="FACE_SCAN_COMPLETED",
        payload_hash=payload_hash,
        previous_hash=previous_hash,
        entry_hash=entry_hash,
    ))