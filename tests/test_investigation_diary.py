from pprint import pprint

from app.services.investigation_diary_service import (
    investigation_diary_service
)

result = investigation_diary_service.summarize()

print("\n========== TIMELINE ==========\n")

pprint(result["timeline"])

print("\n========== AI SUMMARY ==========\n")

print(result["ai_summary"])

print("\n===============================")