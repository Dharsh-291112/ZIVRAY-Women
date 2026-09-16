"""Seeds ZIVRAY with two working sample accounts.

    Doctor  -> email: alisha.patel@zivray.com   password: Password123
    Patient -> email: eliza.fernandes@example.com  password: Password123

Run from the backend folder (so `app` is importable), after schema.sql
has been applied and requirements.txt installed:

    python -m database.seed_users
    python -m database.seed_users --reset
"""
import argparse
import os
import sys

from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models import User, UserRole
from app.security.password import hash_password

SAMPLE_USERS = [
    {
        "full_name": "Dr. Alisha Patel",
        "email": "alisha.patel@zivray.com",
        "phone": "9990001111",
        "password": "Password123",
        "role": UserRole.doctor,a
        "specialization": "Obstetrics & Gynecology",
        "hospital_name": "City Women's Hospital",
    },
    {
        "full_name": "Eliza Fernandes",
        "email": "eliza.fernandes@example.com",
        "phone": "9990002222",
        "password": "Password123",
        "role": UserRole.patient,
    },
]


def create_schema():
    Base.metadata.create_all(bind=engine)


def seed(reset: bool = False):
    db = SessionLocal()
    try:
        try:
            db.execute(text("SELECT 1"))
        except Exception as exc:
            raise RuntimeError(
                "Database connection failed. Make sure PostgreSQL is running and DATABASE_URL is correct."
            ) from exc

        if reset:
            emails = [user["email"] for user in SAMPLE_USERS]
            db.query(User).filter(User.email.in_(emails)).delete(synchronize_session=False)
            db.commit()
            print("Removed existing sample accounts.")

        created_emails = []
        for user_data in SAMPLE_USERS:
            email = user_data["email"]
            if not db.query(User).filter(User.email == email).first():
                db.add(
                    User(
                        full_name=user_data["full_name"],
                        email=email,
                        phone=user_data["phone"],
                        password_hash=hash_password(user_data["password"]),
                        role=user_data["role"],
                        specialization=user_data.get("specialization"),
                        hospital_name=user_data.get("hospital_name"),
                    )
                )
                created_emails.append(email)

        db.commit()

        if created_emails:
            print(f"Seed complete. Created sample accounts: {', '.join(created_emails)}")
        else:
            print("Sample accounts already exist. No new users were created.")
    finally:
        db.close()


def parse_args():
    parser = argparse.ArgumentParser(description="Seed demo users for ZIVRAY.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Delete the sample users first, then recreate them.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    try:
        create_schema()
        seed(reset=args.reset)
    except Exception as exc:
        print(f"Seeding failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
