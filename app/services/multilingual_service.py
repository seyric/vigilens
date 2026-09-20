from app.services.language_service import language_service
from app.services.translation_service import translation_service


class MultilingualService:

    def normalize(self, text: str):

        language = language_service.detect_language(text)

        if language.lower() == "english":

            return {
                "language": language,
                "translated": False,
                "text": text
            }

        translated = translation_service.translate(
            text=text,
            target_language="English"
        )

        return {
            "language": language,
            "translated": True,
            "text": translated
        }


multilingual_service = MultilingualService()