"""
Seeds ZIVRAY with two working sample accounts:

    Doctor  -> email: alisha.patel@zivray.com   password: Password123
    Patient -> email: eliza.fernandes@example.com  password: Password123

Run from the backend/ folder (so `app` is importable), after schema.sql
has been applied and requirements.txt installed:

    python -m database.seed_users
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models import User, UserRole
from app.security.password import hash_password

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "alisha.patel@zivray.com").first():
            db.add(User(
                full_name="Dr. Alisha Patel",
                email="alisha.patel@zivray.com",
                phone="9990001111",
                password_hash=hash_password("Password123"),
                role=UserRole.doctor,
                specialization="Obstetrics & Gynecology",
                hospital_name="City Women's Hospital",
            ))

        if not db.query(User).filter(User.email == "eliza.fernandes@example.com").first():
            db.add(User(
                full_name="Eliza Fernandes",
                email="eliza.fernandes@example.com",
                phone="9990002222",
                password_hash=hash_password("Password123"),
                role=UserRole.patient,
            ))

        db.commit()
        print("Seed complete. Sample accounts ready (password: Password123).")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
