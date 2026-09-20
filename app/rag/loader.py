from pathlib import Path
import fitz  # PyMuPDF


class DocumentLoader:

    def load_text(self, file_path: str) -> str:
        path = Path(file_path)

        if path.suffix.lower() == ".txt":
            with open(path, "r", encoding="utf-8") as file:
                return file.read()

        elif path.suffix.lower() == ".pdf":
            return self.load_pdf(file_path)

        raise ValueError(f"Unsupported file type: {path.suffix}")

    def load_pdf(self, file_path: str) -> str:
        document = fitz.open(file_path)

        text = ""

        for page in document:
            page_text = page.get_text()

            if page_text.strip():
                text += page_text
            else:
                print(f"OCR needed for page {page.number + 1}")

        document.close()

        return text