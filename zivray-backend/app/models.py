import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Boolean, DateTime, ForeignKey, Text, Enum, Integer
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    patient = "patient"
    doctor = "doctor"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    full_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.patient)
    specialization = Column(String(150), nullable=True)   # doctor only
    hospital_name = Column(String(200), nullable=True)    # doctor only
    date_of_birth = Column(DateTime, nullable=True)        # patient only
    profile_photo_url = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    medical_records = relationship("MedicalRecord", back_populates="patient",
                                    foreign_keys="MedicalRecord.patient_id")
    appointments_as_patient = relationship("Appointment", back_populates="patient",
                                            foreign_keys="Appointment.patient_id")
    appointments_as_doctor = relationship("Appointment", back_populates="doctor",
                                           foreign_keys="Appointment.doctor_id")
    notifications = relationship("Notification", back_populates="user")


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    patient_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    record_type = Column(String(50), nullable=False)   # lab_report / prescription / imaging
    title = Column(String(200), nullable=False)
    file_url = Column(String(400), nullable=True)
    ai_summary = Column(Text, nullable=True)
    risk_flag = Column(String(50), nullable=True)       # e.g. PCOS, Anemia, None
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("User", back_populates="medical_records", foreign_keys=[patient_id])


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    patient_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String(30), default="upcoming")     # upcoming / completed / cancelled
    mode = Column(String(30), default="in_person")       # in_person / virtual
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("User", back_populates="appointments_as_patient", foreign_keys=[patient_id])
    doctor = relationship("User", back_populates="appointments_as_doctor", foreign_keys=[doctor_id])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    message = Column(String(300), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class HealthAnalytic(Base):
    __tablename__ = "health_analytics"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    patient_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    metric_name = Column(String(100), nullable=False)   # e.g. Hemoglobin, Cycle Length
    metric_value = Column(String(50), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
