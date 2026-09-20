from app.services.gemini_service import gemini_service


class LanguageService:

    def detect_language(self, text: str) -> str:

        prompt = f"""
Detect the language of the following text.

Rules:
- Return ONLY the language name.
- Example outputs:
English
Hindi
Kannada
Tamil
Telugu
Marathi

Text:

{text}
"""

        return gemini_service.ask(prompt).strip()


language_service = LanguageService()