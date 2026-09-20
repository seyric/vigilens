from pprint import pprint

from app.agents.ai_orchestrator import ai_orchestrator


queries = [
    "Find burglary cases involving motorcycles.",
    "Predict crime hotspots.",
    "Generate investigation report.",
    "Find similar burglary cases.",
    "Analyze suspect digital profile.",
    "Summarize investigation diary."
]

for query in queries:
    print("\n" + "=" * 70)
    print(query)
    print("=" * 70)

    response = ai_orchestrator.process(query)
    pprint(response)
