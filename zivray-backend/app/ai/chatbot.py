from app.ai.ollama_client import query_ollama
from app.ai.prompts import build_prompt


def generate_reply(user_message: str, patient_context: dict) -> str:
    prompt = build_prompt(user_message, patient_context)
    return query_ollama(prompt)
