from app.rag.retriever import retriever
from app.services.confidence_service import confidence_service
from app.services.pattern_match_service import pattern_match_service

class SimilarityAnalyzer:

    def analyze(
        self,
        query: str
    ):

        results = retriever.retrieve(query)

        if not results:
            return {
                "success": False,
                "message": "No similar crimes found."
            }

        similarity, record = results[0]

        similarity_score = round(similarity * 100, 2)

        confidence = confidence_service.generate(
            similarity_score
        )

        return {

            "success": True,

            "overall_match": similarity_score,

            "confidence": confidence,

            "crime_type": record.get(
                "crime_type",
                "Unknown"
            ),

            "location": record.get(
                "location",
                "Unknown"
            ),

            "source": record.get(
                "source",
                "Unknown"
            ),

            "summary": record.get(
                "text",
                ""
            )[:250],

            **pattern_match_service.analyze(
                query,
                record
            ),

            "reason": (
                "High similarity because the crime type, "
                "location and suspect description closely "
                "match historical investigation records."
            )

        }


similarity_analyzer = SimilarityAnalyzer()