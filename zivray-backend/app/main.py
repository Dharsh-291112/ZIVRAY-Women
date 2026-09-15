from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import auth, users, medical_records, appointments, emergency, chatbot

# Creates tables if they don't already exist (schema.sql is the canonical source of truth)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZIVRAY API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(medical_records.router)
app.include_router(appointments.router)
app.include_router(emergency.router)
app.include_router(chatbot.router)


@app.get("/")
def root():
    return {"status": "ZIVRAY API is running"}
