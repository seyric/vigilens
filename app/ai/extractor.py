import json

from app.services.gemini_service import gemini_service


class AIExtractor:
    def extract_fir(self, text: str) -> dict:
        prompt = f"""
You are an AI crime investigation assistant.

Extract the following information from the FIR or crime report.

Return ONLY valid JSON.

Fields:
- fir_number
- crime_type
- location
- suspects
- vehicles
- confidence (return a number between 0 and 1)
- summary (2-3 sentence summary)

Document:
{text}
"""

        response = gemini_service.ask(prompt)
        print(response)
        # Remove Markdown code fences if Gemini adds them
        response = response.replace("```json", "").replace("```", "").strip()
        return json.loads(response)


ai_extractor = AIExtractor()