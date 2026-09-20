import pytest
from fastapi import HTTPException

from backend.ai.translation_service import SUPPORTED_LANGUAGES, TranslationService


@pytest.mark.parametrize(
    ("source_language", "target_language"),
    [
        ("English", "Kannada"),
        ("Kannada", "English"),
        ("English", "Hindi"),
        ("English", "Telugu"),
        ("English", "Tamil"),
        ("English", "Malayalam"),
        ("English", "Marathi"),
    ],
)
def test_translate_text_uses_gemini_for_each_supported_language_pair(
    source_language, target_language
):
    captured_prompts = []

    def fake_ask(prompt):
        captured_prompts.append(prompt)
        return "translated FIR statement"

    service = TranslationService(ask=fake_ask)

    translated_text = service.translate_text(
        "FIR 123/2025 was registered on 14/05/2025.",
        source_language,
        target_language,
    )

    assert translated_text == "translated FIR statement"
    assert f"from {source_language} to {target_language}" in captured_prompts[0]
    assert "Preserve exactly:" in captured_prompts[0]


def test_translate_text_rejects_empty_text():
    with pytest.raises(HTTPException) as error:
        TranslationService().translate_text("   ", "English", "Kannada")

    assert error.value.status_code == 400


def test_translate_text_rejects_unsupported_language():
    with pytest.raises(HTTPException) as error:
        TranslationService().translate_text("Sample text", "English", "French")

    assert error.value.status_code == 400
    assert set(SUPPORTED_LANGUAGES) == {
        "English",
        "Kannada",
        "Hindi",
        "Tamil",
        "Telugu",
        "Malayalam",
        "Marathi",
    }
