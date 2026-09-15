from app.ai.chatbot import generate_reply


def handle_chat_message(user_message: str, patient_context: dict | None = None) -> str:
    return generate_reply(user_message, patient_context or {})
