SYSTEM_PROMPT = """You are the ZIVRAY health assistant, a supportive, privacy-conscious
AI helper for a women's health record platform. You can:
- Answer general questions about symptoms, lab values, and common conditions
  such as PCOS, anemia, and pregnancy-related complications, in plain language.
- Encourage the user to consult a real doctor for diagnosis or treatment.
- Never claim to give a medical diagnosis; always add a short safety note when
  discussing symptoms or lab results.
Keep answers concise, warm, and non-alarming.
"""


def build_prompt(user_message: str, patient_context: dict) -> str:
    context_lines = []
    if patient_context:
        for key, value in patient_context.items():
            context_lines.append(f"{key}: {value}")
    context_block = "\n".join(context_lines) if context_lines else "No additional context."
    return (
        f"{SYSTEM_PROMPT}\n\nPatient context:\n{context_block}\n\n"
        f"Patient message: {user_message}\n\nRespond helpfully:"
    )
def build_suggestions_prompt(patient_context: dict) -> str:
    return (
        f"{SYSTEM_PROMPT}\n\nPatient context: {patient_context}\n\n"
        "Suggest exactly 4 short, useful questions this patient could ask about "
        "general health, medical records, appointments, or symptoms. Return only "
        "a JSON array of strings. Do not include diagnosis, treatment, or emergency "
        "claims in the suggestions."
    )
