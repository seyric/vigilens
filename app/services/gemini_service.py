import asyncio

from app.core.config import settings
from app.core.model_manager import model_manager
from backend.ai.provider import GeminiProvider, OllamaProvider, get_llm_provider


class GeminiService:
    def __init__(self):
        self.provider = get_llm_provider()
        self.model = getattr(settings, "GEMINI_MODEL", "gemini-2.0-flash")
        self.client = None

        if isinstance(self.provider, GeminiProvider):
            self.client = self.provider.client

    def ask(self, prompt: str) -> str:
        try:
            if hasattr(self.provider, "generate"):
                return asyncio.run(
                    self.provider.generate(prompt, system="You are Vigilens, a professional crime intelligence assistant.")
                )
        except Exception as exc:
            if self.provider.name == "ollama":
                raise RuntimeError(
                    f"Local AI unavailable: Ollama is not reachable at {getattr(self.provider, 'base_url', 'http://localhost:11434')}. "
                    "Start Ollama or switch AI_PROVIDER to gemini."
                ) from exc
            raise

        last_error = None
        for model in model_manager.get_models():
            try:
                client = self.client or GeminiProvider().client
                if client is None:
                    raise RuntimeError("No Gemini client is configured.")
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                )
                return response.text
            except Exception as e:
                last_error = e
                continue

        raise RuntimeError(f"All AI models failed. Last error: {last_error}")

    def is_available(self) -> bool:
        return self.provider.is_available() or (self.client is not None)


gemini_service = GeminiService()