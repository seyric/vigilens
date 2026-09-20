from app.ml.hotspot_predictor import hotspot_predictor
from app.ml.explainability_service import explainability_service

class PredictionAgent:

    def predict_hotspots(self):

        hotspots = hotspot_predictor.get_hotspots()

        # Highest risk area
        top_area = hotspots.iloc[0]

        highest_risk_area = top_area["Area"]
        crime_count = int(top_area["Crime Count"])

        # Simple Risk Score (0-100)
        max_crime = hotspots["Crime Count"].max()

        risk_score = float(round((crime_count / max_crime) * 100, 2))

        # Confidence (Demo Version)
        confidence = 0.95

        # Risk Level
        if risk_score >= 80:
            risk_level = "High"
        elif risk_score >= 50:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        explanation = explainability_service.explain_prediction(
        highest_risk_area,
        crime_count,
        risk_level,
        confidence
        )

        return {
            "highest_risk_area": highest_risk_area,
            "crime_count": crime_count,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "confidence": confidence,
            "hotspots": hotspots.to_dict(orient="records"),
            "explanation": explanation
        }


prediction_agent = PredictionAgent()