"""In-memory extraction for permitted evidence uploads."""
import io
from pathlib import Path
from fastapi import HTTPException
from utils.logger import logger

_easyocr_reader = None

class DocumentTextExtractor:
    def _get_reader(self):
        global _easyocr_reader
        if _easyocr_reader is None:
            try:
                import easyocr
                logger.info("Initializing EasyOCR reader instance for English...")
                _easyocr_reader = easyocr.Reader(["en"], gpu=False, verbose=False)
            except Exception as e:
                logger.exception("Failed to initialize EasyOCR reader: {}", str(e))
                raise HTTPException(status_code=503, detail="Document extraction library (easyocr) failed to load.") from e
        return _easyocr_reader

    def extract(self, filename: str, content: bytes) -> str:
        ext = Path(filename).suffix.lower()
        try:
            if ext == ".txt":
                return content.decode("utf-8-sig", errors="replace").strip()
            if ext == ".pdf":
                import fitz
                with fitz.open(stream=content, filetype="pdf") as document:
                    return "\n".join(page.get_text("text") for page in document).strip()
            
            # Use cached easyocr reader
            reader = self._get_reader()
            results = reader.readtext(io.BytesIO(content), detail=0)
            return "\n".join(results).strip()
        except ImportError as error:
            logger.exception("Dependency import failed during document text extraction")
            raise HTTPException(status_code=503, detail="Required document extraction dependency is not installed.") from error
        except Exception as error:
            logger.exception("Document text extraction failed")
            raise HTTPException(status_code=422, detail=f"Document text extraction failed: {str(error)}") from error
