from pprint import pprint

from app.services.similarity_analyzer import similarity_analyzer


result = similarity_analyzer.analyze(
    "Burglary involving motorcycle"
)

print("\n========== SIMILARITY ANALYZER ==========\n")

pprint(result)

print("\n========================================")