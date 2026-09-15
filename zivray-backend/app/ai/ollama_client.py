import requests

from app.config import settings


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
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()
    except requests.RequestException as exc:
        return (
            "I'm unable to reach the AI engine right now. "
            "Please make sure Ollama is running locally. "
            f"(details: {exc})"
        )
