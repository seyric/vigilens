from pprint import pprint

from app.services.confidence_service import confidence_service


result = confidence_service.generate(92.48)

print("\n========== CONFIDENCE ==========\n")

pprint(result)

print("\n===============================")