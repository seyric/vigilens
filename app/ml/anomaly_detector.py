import pandas as pd


class AnomalyDetector:

    def __init__(self):
        self.df = pd.read_csv("data/prediction/crime_dataset.csv")

    def detect(self, record):

        anomalies = []

        average_value = self.df["property_value"].mean()

        if record["property_value"] > average_value * 3:
            anomalies.append(
                "Property value is unusually high."
            )

        hour = int(record["time"].split(":")[0])

        if hour >= 2 and hour <= 4:
            anomalies.append(
                "Crime occurred during unusual hours."
            )

        if len(anomalies) == 0:

            return {
                "is_anomaly": False,
                "anomaly_count": 0,
                "reasons": [
                    "No significant anomaly detected."
                ]
            }

        return {
            "is_anomaly": True,
            "anomaly_count": len(anomalies),
            "reasons": anomalies
        }


anomaly_detector = AnomalyDetector()