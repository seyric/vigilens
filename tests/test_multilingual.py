from app.services.multilingual_service import multilingual_service


text = """
एफआईआर संख्या: FIR-001

अपराध: चोरी

स्थान: कनॉट प्लेस

संदिग्ध व्यक्ति काले रंग की हुडी पहनकर मोटरसाइकिल से भाग गया।
"""

result = multilingual_service.normalize(text)

print("\n========== MULTILINGUAL ==========\n")

print(result)

print("\n=================================")