import pandas as pd


class RiskEngine:

    def calculate(self, record):

        score = 0
        reasons = []

        # High-value property
        if record["property_value"] >= 1000000:
            score += 30
            reasons.append("High-value property")

        # Weapon used
        if record["weapon_used"] == "Yes":
            score += 20
            reasons.append("Weapon involved")

        # Night crime
        hour = int(record["time"].split(":")[0])

        if hour >= 20 or hour <= 5:
            score += 20
            reasons.append("Night-time incident")

        # No arrest made
        if record["arrest_made"] == "No":
            score += 15
            reasons.append("Suspect not arrested")

        # Cap at 100
        score = min(score, 100)

        return {
            "risk_score": score,
            "reasons": reasons
        }


risk_engine = RiskEngine()