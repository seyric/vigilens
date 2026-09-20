from backend.ai.translation_service import TranslationService


def test_translation_service_is_available():
    assert isinstance(TranslationService(), TranslationService)
