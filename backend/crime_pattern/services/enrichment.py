"""Best-effort cached Gemini enrichment; never used for SQL."""
import json
import os
from functools import lru_cache
from utils.logger import logger

class GeminiEnricher:
    @lru_cache(maxsize=64)
    def enrich(self, text: str, parsed_json: str):
        key = os.getenv("GEMINI_API_KEY", "").strip()
        if not key or key.startswith("your_"):
            logger.info("GEMINI_API_KEY is not configured; skipping AI enrichment summary.")
            return {}, None

        try:
            from google import genai
            prompt = (
                "Return strict JSON only with entities and summary. Extract only corroborated crime entities and a category; "
                f"do not invent facts. Never generate SQL. Regex output: {parsed_json}. Text: {text[:12000]}"
            )
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            raw_text = response.text or ""
            cleaned_text = raw_text.strip().replace("```json", "").replace("```", "").strip()
            if not cleaned_text:
                return {}, None

            result = json.loads(cleaned_text)
            entities = result.get("entities", {})
            summary = result.get("summary", None)
            return entities, summary
        except Exception as error:
            logger.warning("Gemini crime-pattern enrichment failed: {} - {}", type(error).__name__, str(error))
            return {}, None
