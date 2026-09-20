class ExplainabilityService:

    def explain_prediction(
        self,
        highest_risk_area,
        crime_count,
        risk_level,
        confidence
    ):

        return (
            f"The model predicts that '{highest_risk_area}' is a "
            f"{risk_level} risk area because it has the highest "
            f"recorded crime count ({crime_count}) in the dataset. "
            f"The prediction confidence is {confidence * 100:.0f}%."
        )


explainability_service = ExplainabilityService()
