class ConfidenceService:

    def generate(
        self,
        similarity_score: float
    ):

        if similarity_score >= 90:
            level = "Very High"

        elif similarity_score >= 75:
            level = "High"

        elif similarity_score >= 60:
            level = "Medium"

        else:
            level = "Low"

        return {
            "confidence": round(similarity_score, 2),
            "confidence_level": level
        }


confidence_service = ConfidenceService()