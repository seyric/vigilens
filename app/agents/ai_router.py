from app.agents.investigation_agent import investigation_agent
from app.agents.prediction_agent import prediction_agent
from app.agents.report_agent import report_agent

from app.services.similarity_analyzer import similarity_analyzer
from app.services.digital_intelligence_service import (
    digital_intelligence_service,
)
from app.services.investigation_diary_service import (
    investigation_diary_service,
)


class AIRouter:

    def route(self, query: str):

        query_lower = query.lower()

        # Prediction
        if any(word in query_lower for word in [
            "hotspot",
            "prediction",
            "predict",
            "risk",
            "crime trend"
        ]):

            return prediction_agent.predict_hotspots()

        # Similar Crime Detection
        elif any(word in query_lower for word in [
            "similar",
            "match",
            "pattern",
            "related case"
        ]):

            return similarity_analyzer.analyze(query)

        # Digital Intelligence
        elif any(word in query_lower for word in [
            "suspect",
            "digital",
            "phone",
            "imei",
            "ip"
        ]):

            return digital_intelligence_service.analyze()

        # Investigation Diary
        elif any(word in query_lower for word in [
            "diary",
            "timeline",
            "progress",
            "case status"
        ]):

            return investigation_diary_service.summarize()

        # Report
        elif any(word in query_lower for word in [
            "report",
            "summary",
            "generate report"
        ]):

            investigation = investigation_agent.investigate(query)

            return report_agent.generate_report(
                investigation
            )

        # Investigation
        else:

            return investigation_agent.investigate(query)


ai_router = AIRouter()