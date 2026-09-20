from app.agents.ai_orchestrator import ai_orchestrator

query = input("Enter your query: ")

result = ai_orchestrator.process(query)

print("\n========== AI ORCHESTRATOR ==========\n")

print(result)

print("\n=====================================")