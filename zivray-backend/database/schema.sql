-- ZIVRAY Database Schema (PostgreSQL)
-- Run: psql -U postgres -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()

DROP TABLE IF EXISTS health_analytics CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TYPE user_role AS ENUM ('patient', 'doctor');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    specialization VARCHAR(150),      -- doctors only
    hospital_name VARCHAR(200),       -- doctors only
    date_of_birth DATE,               -- patients only
    profile_photo_url VARCHAR(300),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL,        -- lab_report | prescription | imaging
    title VARCHAR(200) NOT NULL,
    file_url VARCHAR(400),
    ai_summary TEXT,
    risk_flag VARCHAR(50),                    -- e.g. PCOS, Anemia, None
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'upcoming',   -- upcoming | completed | cancelled
    mode VARCHAR(30) NOT NULL DEFAULT 'in_person',     -- in_person | virtual
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message VARCHAR(300) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE health_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,     -- e.g. Hemoglobin, Cycle Length, BMI
    metric_value VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_records_patient ON medical_records(patient_id);
CREATE INDEX idx_appt_patient ON appointments(patient_id);
CREATE INDEX idx_appt_doctor ON appointments(doctor_id);
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_analytics_patient ON health_analytics(patient_id);

-- ---------------------------------------------------------------
-- Sample users: do NOT insert plaintext or guessed bcrypt hashes here.
-- Run database/seed_users.py (in this folder) after installing backend
-- requirements -- it hashes real passwords with the same passlib/bcrypt
-- setup the FastAPI app uses, then inserts the rows for you.
-- ---------------------------------------------------------------
