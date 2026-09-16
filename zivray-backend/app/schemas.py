from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, field_validator


# ---------- AUTH ----------

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: str  # "patient" or "doctor"
    specialization: Optional[str] = None
    hospital_name: Optional[str] = None

    @field_validator("role")
    @classmethod
    def validate_role(cls, v):
        if v not in ("patient", "doctor"):
            raise ValueError("role must be 'patient' or 'doctor'")
        return v


class LoginRequest(BaseModel):
    identifier: str   # email or phone
    password: str
    role: str          # "patient" or "doctor"  -> comes from the toggle


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str
    specialization: Optional[str] = None
    hospital_name: Optional[str] = None
    profile_photo_url: Optional[str] = None

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()


# ---------- MEDICAL RECORDS ----------

class MedicalRecordOut(BaseModel):
    id: str
    record_type: str
    title: str
    file_url: Optional[str] = None
    ai_summary: Optional[str] = None
    risk_flag: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


class MedicalRecordCreate(BaseModel):
    record_type: str
    title: str
    file_url: Optional[str] = None


# ---------- APPOINTMENTS ----------

class AppointmentOut(BaseModel):
    id: str
    patient_id: str
    doctor_id: str
    scheduled_at: datetime
    status: str
    mode: str
    notes: Optional[str] = None
    doctor_name: Optional[str] = None
    patient_name: Optional[str] = None

    class Config:
        from_attributes = True


class AppointmentCreate(BaseModel):
    doctor_id: str
    scheduled_at: datetime
    mode: str = "in_person"
    notes: Optional[str] = None


# ---------- NOTIFICATIONS ----------

class NotificationOut(BaseModel):
    id: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- HEALTH ANALYTICS ----------

class HealthAnalyticOut(BaseModel):
    metric_name: str
    metric_value: str
    recorded_at: datetime

    class Config:
        from_attributes = True


class HealthAnalyticCreate(BaseModel):
    metric_name: str
    metric_value: str
    recorded_at: Optional[datetime] = None


class CycleEventCreate(BaseModel):
    event_date: date
    event_type: str
    notes: Optional[str] = None


class CycleEventOut(CycleEventCreate):
    id: str

    class Config:
        from_attributes = True


# ---------- CHATBOT ----------

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


class ChatMessageOut(BaseModel):
    id: str
    sender: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatSuggestionsResponse(BaseModel):
    suggestions: List[str]
