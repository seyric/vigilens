from app.ai.extractor import ai_extractor
from app.rag.loader import DocumentLoader

loader = DocumentLoader()

text = loader.load_text("data/raw/sample_case.txt")

result = ai_extractor.extract_fir(text)

print("\n========== AI EXTRACTION ==========\n")
print(result)
print("\n==================================")