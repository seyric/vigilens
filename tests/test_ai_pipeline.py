from app.agents.ai_orchestrator import ai_orchestrator

queries = [

    "Find burglary cases involving motorcycles.",

    "Predict crime hotspots.",

    "Generate investigation report."

]

for query in queries:

    print("\n" + "=" * 60)

    print(f"QUERY: {query}")

    print("=" * 60)

    result = ai_orchestrator.process(query)

    print(result)