from app.ai.chatbot import generate_reply, generate_suggestions


def handle_chat_message(user_message: str, patient_context: dict | None = None) -> str:
    return generate_reply(user_message, patient_context or {})


def get_chat_suggestions(patient_context: dict | None = None) -> list[str]:
    return generate_suggestions(patient_context or {})
