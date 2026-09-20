import pytesseract
from PIL import Image
from pathlib import Path
import os


class OCRService:
    def __init__(self):
        configured_path = os.getenv("TESSERACT_CMD", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
        self.tesseract_path = Path(configured_path)
        pytesseract.pytesseract.tesseract_cmd = str(self.tesseract_path)

    def extract_text(self, image_path: str) -> str:
        if not self.tesseract_path.is_file():
            return ""
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text


ocr_service = OCRService()
