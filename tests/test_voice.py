from pprint import pprint

from app.services.voice_service import voice_service


response = voice_service.process_voice_query(
    "Find burglary cases involving motorcycles."
)

print("\n========== VOICE SEARCH ==========\n")

pprint(response)

print("\n=================================")