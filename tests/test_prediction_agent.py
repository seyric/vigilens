from pprint import pprint

from app.agents.prediction_agent import prediction_agent

result = prediction_agent.predict_hotspots()

print("\n========== PREDICTION ==========\n")

pprint(result)

print("\n================================")