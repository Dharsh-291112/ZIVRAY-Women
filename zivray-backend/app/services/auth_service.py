from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import User, UserRole
from app.schemas import RegisterRequest, LoginRequest
from app.security.password import hash_password, verify_password
from app.security.auth import create_access_token


def register_user(db: Session, payload: RegisterRequest) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role=UserRole(payload.role),
        specialization=payload.specialization,
        hospital_name=payload.hospital_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> User:
    user = (
        db.query(User)
        .filter(
            (User.email == payload.identifier) | (User.phone == payload.identifier)
        )
        .first()
    )
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    if user.role.value != payload.role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"This account is not registered as a {payload.role}",
        )
    return user


def build_token_for_user(user: User) -> str:
    return create_access_token({"sub": str(user.id), "role": user.role.value})
