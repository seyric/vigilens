from app.agents.investigation_agent import investigation_agent
from app.agents.report_agent import report_agent


investigation = investigation_agent.investigate(
    "Find burglary cases involving motorcycles."
)

report = report_agent.generate_report(
    investigation
)

print("\n========== REPORT ==========\n")

print(report)

print("\n============================")