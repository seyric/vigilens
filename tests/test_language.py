from app.services.language_service import language_service


text = """
एफआईआर संख्या: FIR-001

अपराध: चोरी

स्थान: कनॉट प्लेस
"""

language = language_service.detect_language(text)

print("\n========== LANGUAGE ==========\n")

print(language)

print("\n==============================")