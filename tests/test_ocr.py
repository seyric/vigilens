from app.services.ocr_service import ocr_service

text = ocr_service.extract_text("data/raw/images/sample_fir.jpg")

print("\n========== EXTRACTED TEXT ==========\n")
print(text)
print("\n===================================")