# ZIVRAY — Backend (FastAPI + PostgreSQL)

## 1. Prerequisites
- Python 3.10+
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)
- VS Code (recommended) with the Python extension

## 2. Setup

```bash
cd zivray-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit DATABASE_URL / JWT_SECRET_KEY
```

## 3. Create the database

```bash
# create an empty database first, e.g.:
createdb zivray_db

# apply schema
psql -U your_pg_user -d zivray_db -f database/schema.sql
```

## 4. Seed two working sample accounts (recommended)

```bash
python -m database.seed_users
```

This creates:
| Role    | Email                         | Password     |
|---------|--------------------------------|--------------|
| Doctor  | alisha.patel@zivray.com        | Password123  |
| Patient | eliza.fernandes@example.com    | Password123  |

## 5. Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## 6. Notes
- Auth uses JWT (`python-jose`) + bcrypt password hashing (`passlib`).
- The `role` field distinguishes **patient** vs **doctor** accounts and is required at login — this is what the frontend's Patient/Doctor toggle sends.
- The AI chatbot layer (`app/ai/`) talks to a locally running [Ollama](https://ollama.com) instance. Install Ollama, run `ollama pull llama3`, then `ollama serve`. If Ollama isn't running, the chatbot endpoint returns a friendly fallback message instead of failing.
- `Base.metadata.create_all()` in `main.py` will also create tables automatically if you skip step 3, but running `schema.sql` directly gives you full control (indexes, extensions, etc.) and is recommended.
