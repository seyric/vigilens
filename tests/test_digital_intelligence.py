from pprint import pprint

from app.services.digital_intelligence_service import (
    digital_intelligence_service
)

result = digital_intelligence_service.analyze()

print("\n========== PROFILE ==========\n")

pprint(result["profile"])

print("\n========== AI SUMMARY ==========\n")

print(result["ai_summary"])

print("\n===============================")