from __future__ import annotations

import json
import os
from typing import Any, Protocol
from urllib import error, request


class LLMProvider(Protocol):
    async def generate(
        self,
        prompt: str,
        *,
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> str: ...

    async def embed(self, texts: list[str]) -> list[list[float]]: ...

    def is_available(self) -> bool: ...

    @property
    def name(self) -> str: ...


class GeminiProvider:
    def __init__(self) -> None:
        self.api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self._client = None
        try:
            from google import genai

            if self.api_key:
                self._client = genai.Client(api_key=self.api_key)
        except Exception:
            self._client = None

    @property
    def client(self):
        return self._client

    @property
    def name(self) -> str:
        return "gemini"

    async def generate(
        self,
        prompt: str,
        *,
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> str:
        if not self.is_available():
            raise RuntimeError("Gemini is unavailable. Set GEMINI_API_KEY to enable cloud inference.")

        payload = {
            "system_instruction": system,
            "temperature": temperature,
            "max_output_tokens": max_tokens,
        }
        response = self._client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=payload,
        )
        return getattr(response, "text", str(response)).strip()

    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not self.is_available():
            raise RuntimeError("Gemini embeddings are unavailable. Set GEMINI_API_KEY to enable embeddings.")

        return []

    def is_available(self) -> bool:
        return self._client is not None


class GrokProvider:
    """OpenAI-compatible xAI provider. The API key is read only from .env."""

    def __init__(self) -> None:
        self.api_key = (os.getenv("GROK_API_KEY") or "").strip()
        self.base_url = (os.getenv("GROK_BASE_URL") or "https://api.x.ai/v1").rstrip("/")
        self.model = os.getenv("GROK_MODEL", "grok-3-mini")

    @property
    def name(self) -> str:
        return "grok"

    def is_available(self) -> bool:
        return bool(self.api_key)

    async def generate(
        self,
        prompt: str,
        *,
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> str:
        if not self.is_available():
            raise RuntimeError("Grok is unavailable. Set GROK_API_KEY in the backend environment.")

        payload = json.dumps({
            "model": self.model,
            "messages": [
                {"role": "system", "content": system or "You are Vigilens."},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": max_tokens,
            "temperature": temperature,
        }).encode("utf-8")
        req = request.Request(
            f"{self.base_url}/chat/completions",
            data=payload,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.api_key}"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
                return str(result["choices"][0]["message"]["content"]).strip()
        except (error.URLError, error.HTTPError, TimeoutError, KeyError, IndexError, ValueError) as exc:
            raise RuntimeError(f"Grok request failed: {exc}") from exc

    async def embed(self, texts: list[str]) -> list[list[float]]:
        raise RuntimeError("Grok embeddings are not configured; use Ollama for local embeddings.")


class OllamaProvider:
    def __init__(self) -> None:
        self.base_url = (os.getenv("OLLAMA_BASE_URL") or "http://localhost:11434").rstrip("/")
        self.model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
        self.embed_model = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

    @property
    def name(self) -> str:
        return "ollama"

    def _request(self, path: str, payload: dict[str, Any] | None = None, *, method: str = "POST") -> dict[str, Any]:
        url = f"{self.base_url}{path}"
        data = None
        headers = {"Content-Type": "application/json"}

        if payload is not None:
            data = json.dumps(payload).encode("utf-8")

        req = request.Request(url, data=data, headers=headers, method=method)
        try:
            with request.urlopen(req, timeout=5) as response:
                body = response.read().decode("utf-8")
                if not body:
                    return {}
                return json.loads(body)
        except (error.URLError, error.HTTPError, TimeoutError, ValueError) as exc:
            raise RuntimeError(f"Local AI unavailable: Ollama could not be reached at {self.base_url}. {exc}") from exc

    def is_available(self) -> bool:
        try:
            self._request("/api/tags", method="GET")
            return True
        except RuntimeError:
            return False

    async def generate(
        self,
        prompt: str,
        *,
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> str:
        if not self.is_available():
            raise RuntimeError(
                f"Local AI unavailable: Ollama is not reachable at {self.base_url}. "
                "Start the Ollama server or switch to a different provider."
            )

        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system or "You are Vigilens, a professional crime intelligence assistant.",
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
        }
        result = self._request("/api/generate", payload)
        text = result.get("response", "")
        return str(text).strip()

    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not self.is_available():
            raise RuntimeError(f"Local AI unavailable: Ollama embeddings are not reachable at {self.base_url}.")

        payload = {
            "model": self.embed_model,
            "input": texts,
        }
        result = self._request("/api/embed", payload)
        embedding_data = result.get("embeddings") or result.get("embedding")
        if isinstance(embedding_data, list):
            if embedding_data and isinstance(embedding_data[0], list):
                return embedding_data
            return [embedding_data]
        return []


class OpenAICompatibleProvider:
    """Provider for local servers exposing the OpenAI-compatible API."""

    def __init__(self) -> None:
        self.base_url = (os.getenv("OPENAI_COMPATIBLE_BASE_URL") or "http://127.0.0.1:8080/v1").rstrip("/")
        self.api_key = (os.getenv("OPENAI_COMPATIBLE_API_KEY") or "").strip()
        self.model = os.getenv("OPENAI_COMPATIBLE_MODEL", "local-model")
        self.embed_model = os.getenv("OPENAI_COMPATIBLE_EMBED_MODEL", "")

    @property
    def name(self) -> str:
        return "openai-compatible"

    def _request(self, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        req = request.Request(
            f"{self.base_url}{path}",
            data=data,
            headers=headers,
            method="POST" if data else "GET",
        )
        try:
            with request.urlopen(req, timeout=5) as response:
                body = response.read().decode("utf-8")
                return json.loads(body) if body else {}
        except (error.URLError, error.HTTPError, TimeoutError, ValueError) as exc:
            raise RuntimeError(f"OpenAI-compatible AI is unavailable at {self.base_url}. {exc}") from exc

    def is_available(self) -> bool:
        try:
            self._request("/models")
            return True
        except RuntimeError:
            return False

    async def generate(
        self,
        prompt: str,
        *,
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.3,
    ) -> str:
        if not self.is_available():
            raise RuntimeError(
                f"OpenAI-compatible AI is unavailable at {self.base_url}. "
                "Start llama.cpp, vLLM, LocalAI, LM Studio, or another compatible server."
            )
        result = self._request(
            "/chat/completions",
            {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system or "You are Vigilens."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
        )
        try:
            return str(result["choices"][0]["message"]["content"]).strip()
        except (KeyError, IndexError, TypeError) as exc:
            raise RuntimeError("OpenAI-compatible provider returned an invalid response.") from exc

    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not self.embed_model:
            raise RuntimeError("Set OPENAI_COMPATIBLE_EMBED_MODEL to enable local embeddings.")
        result = self._request("/embeddings", {"model": self.embed_model, "input": texts})
        return [item["embedding"] for item in result.get("data", []) if "embedding" in item]


def get_llm_provider() -> LLMProvider:
    provider_name = (os.getenv("AI_PROVIDER") or "ollama").strip().lower()

    if provider_name in {"gemini", "google"}:
        return GeminiProvider()
    if provider_name in {"grok", "xai"}:
        return GrokProvider()
    if provider_name in {"ollama", "local", "default"}:
        return OllamaProvider()
    if provider_name in {
        "openai-compatible", "openai_compatible", "llamacpp", "llama.cpp",
        "vllm", "localai", "lmstudio", "open-webui",
    }:
        return OpenAICompatibleProvider()
    if provider_name == "hybrid":
        local = OllamaProvider()
        if local.is_available():
            return local
        if GeminiProvider().is_available():
            return GeminiProvider()
        return GrokProvider()
    return OllamaProvider()


def get_provider_status() -> dict[str, object]:
    providers = [OllamaProvider(), OpenAICompatibleProvider(), GeminiProvider(), GrokProvider()]
    return {
        "active": (os.getenv("AI_PROVIDER") or "ollama").strip().lower(),
        "supported": [provider.name for provider in providers] + ["hybrid"],
        "available": [provider.name for provider in providers if provider.is_available()],
    }
