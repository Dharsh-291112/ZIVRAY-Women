import json

from app.ai.ollama_client import query_ollama
from app.ai.ollama_client import AI_UNAVAILABLE_MESSAGE
from app.ai.prompts import build_prompt, build_suggestions_prompt

DEFAULT_SUGGESTIONS = [
    "What questions should I ask my doctor about my symptoms?",
    "Can you explain a lab report in simple language?",
    "How can I prepare for my next appointment?",
    "What health records should I keep up to date?",
]

OUT_OF_SCOPE_MESSAGE = (
    "I’m here to help with women’s health and your ZIVRAY care journey. "
    "I can’t help with that topic, but you’re welcome to ask about symptoms, "
    "periods, pregnancy, reproductive health, menopause, medical records, "
    "appointments, or lab reports."
)

WOMENS_HEALTH_TERMS = {
    "period", "menstrual", "menstruation", "cycle", "ovulation", "pcos",
    "endometriosis", "pregnan", "prenatal", "postpartum", "breast", "mammogram",
    "pap smear", "cervical", "ovary", "ovarian", "uterus", "fertility", "menopause",
    "perimenopause", "contraception", "birth control", "vaginal", "pelvic",
    "sexual health", "yeast infection", "uti", "women's health", "womens health",
}

CARE_PLATFORM_TERMS = {
    "medication", "prescription", "medicine", "lab", "test result", "report",
    "doctor", "appointment", "medical record", "health record", "zivray",
}


def is_womens_health_question(message: str) -> bool:
    normalized = message.casefold()
    return any(term in normalized for term in WOMENS_HEALTH_TERMS) or any(
        term in normalized for term in CARE_PLATFORM_TERMS
    )


def generate_reply(user_message: str, patient_context: dict) -> str:
    if not is_womens_health_question(user_message):
        return OUT_OF_SCOPE_MESSAGE
    prompt = build_prompt(user_message, patient_context)
    response = query_ollama(prompt)
    if response == AI_UNAVAILABLE_MESSAGE:
        return (
            "I can help you think through women’s health questions, but my live AI "
            "service is temporarily unavailable. Please try again shortly, or contact "
            "your doctor for urgent or personalized advice."
        )
    return response


def generate_suggestions(patient_context: dict) -> list[str]:
    response = query_ollama(build_suggestions_prompt(patient_context))
    if response == AI_UNAVAILABLE_MESSAGE:
        return DEFAULT_SUGGESTIONS
    try:
        suggestions = json.loads(response)
        if isinstance(suggestions, list):
            cleaned = [item.strip() for item in suggestions if isinstance(item, str) and item.strip()]
            if len(cleaned) >= 2:
                return cleaned[:4]
    except json.JSONDecodeError:
        pass
    return DEFAULT_SUGGESTIONS
