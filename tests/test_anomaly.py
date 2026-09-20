import pandas as pd

from app.ml.anomaly_detector import anomaly_detector

df = pd.read_csv("data/prediction/crime_dataset.csv")

record = df.iloc[0]

result = anomaly_detector.detect(record)

print("\n========== ANOMALY DETECTION ==========\n")

print(f"Anomaly Detected : {result['is_anomaly']}")
print(f"Anomaly Count    : {result['anomaly_count']}")

print("\nReasons:")

for reason in result["reasons"]:
    print(f"- {reason}")

print("\n======================================")