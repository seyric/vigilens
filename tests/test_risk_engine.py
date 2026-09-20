import pandas as pd

from app.ml.risk_engine import risk_engine

df = pd.read_csv("data/prediction/crime_dataset.csv")

record = df.iloc[0]

result = risk_engine.calculate(record)

print("\n========== RISK ANALYSIS ==========\n")
print(result)
print("\n===================================")