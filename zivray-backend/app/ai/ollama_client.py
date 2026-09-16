import requests

from app.config import settings

AI_UNAVAILABLE_MESSAGE = (
    "The AI assistant is temporarily unavailable. You can still ask a general "
    "health question, and please contact your doctor for personalized medical advice."
)


def query_ollama(prompt: str) -> str:
    """
    Sends a prompt to a locally running Ollama instance.
    Requires `ollama serve` running and the model pulled, e.g.:
        ollama pull llama3
    """
    try:
        response = requests.post(
            f"{settings.OLLAMA_BASE_URL}/api/generate",
            json={"model": settings.OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()
    except requests.RequestException as exc:
        return AI_UNAVAILABLE_MESSAGE
