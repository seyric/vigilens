import json

from app.services.gemini_service import gemini_service


class InvestigationDiaryService:

    def summarize(self):

        with open(
            "data/investigation/diary.json",
            "r",
            encoding="utf-8"
        ) as file:

            diary = json.load(file)

        prompt = f"""
You are a Senior Investigation Officer.

Review the following investigation diary.

Generate:

1. Investigation Progress
2. Current Case Status
3. Missing Steps
4. Recommended Next Action

Diary:

{json.dumps(diary, indent=4)}
"""

        summary = gemini_service.ask(prompt)

        return {

            "timeline": diary,

            "ai_summary": summary

        }


investigation_diary_service = InvestigationDiaryService()