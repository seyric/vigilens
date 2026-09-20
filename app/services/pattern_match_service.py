import re


class PatternMatchService:

    def _contains(self, query: str, value: str):

        return value.lower() in query.lower()

    def analyze(
        self,
        query: str,
        record: dict
    ):

        text = record.get("text", "").lower()

        query = query.lower()

        vehicle = 95 if any(
            word in text and word in query
            for word in [
                "motorcycle",
                "car",
                "bike",
                "truck",
                "bus"
            ]
        ) else 40

        location = 95 if any(
            word in text and word in query
            for word in [
                "connaught",
                "rohini",
                "dwarka",
                "saket",
                "karol"
            ]
        ) else 50

        crime = 98 if any(
            word in text and word in query
            for word in [
                "burglary",
                "theft",
                "murder",
                "robbery",
                "assault"
            ]
        ) else 45

        suspect = 90 if re.search(
            r"hoodie|mask|helmet",
            text
        ) else 60

        return {

            "vehicle_match": vehicle,

            "location_match": location,

            "crime_type_match": crime,

            "suspect_match": suspect

        }


pattern_match_service = PatternMatchService()