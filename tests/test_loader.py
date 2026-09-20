from app.rag.loader import DocumentLoader

loader = DocumentLoader()

text = loader.load_text("data/raw/sample_case.txt")

print(text)
