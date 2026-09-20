from app.rag.loader import DocumentLoader

loader = DocumentLoader()

text = loader.load_text("data/raw/pdfs/scanned_certificate.pdf")

print("\n========== PDF TEXT ==========\n")
print(text)
print("\n==============================")