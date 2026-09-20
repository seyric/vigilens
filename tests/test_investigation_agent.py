from app.agents.investigation_agent import investigation_agent

response = investigation_agent.investigate(
    "Find burglary cases involving motorcycles."
)

print("\n========== INVESTIGATION AGENT ==========\n")

print(response)

print("\n=========================================")