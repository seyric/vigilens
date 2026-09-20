import json

from app.services.gemini_service import gemini_service


class DigitalIntelligenceService:

    def analyze(self):

        with open(
            "data/intelligence/suspect_profile.json",
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        prompt = f"""
You are an AI Crime Investigation Assistant.

Analyze the following suspect profile.

Generate:

1. Investigation Summary
2. Risk Assessment
3. Key Findings
4. Recommended Next Steps

Suspect Profile:

{json.dumps(data, indent=4)}
"""

        summary = gemini_service.ask(prompt)

        return {

            "profile": data,

            "ai_summary": summary

        }


digital_intelligence_service = DigitalIntelligenceService()