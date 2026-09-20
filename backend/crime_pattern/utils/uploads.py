"""Upload validation; evidence bytes are not persisted."""
from pathlib import Path
from fastapi import HTTPException, UploadFile
from utils.logger import logger

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt"}

async def read_upload(upload: UploadFile) -> bytes:
    if not upload.filename:
        logger.warning("Upload rejected: missing filename")
        raise HTTPException(status_code=422, detail="A filename is required.")
        
    ext = Path(upload.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        logger.warning("Upload rejected: unsupported extension {}", ext)
        raise HTTPException(status_code=415, detail="Supported formats: PDF, PNG, JPG, JPEG, TXT.")
        
    content = await upload.read(MAX_UPLOAD_BYTES + 1)
    if not content:
        logger.warning("Upload rejected: empty file content")
        raise HTTPException(status_code=422, detail="The uploaded file is empty.")
        
    if len(content) > MAX_UPLOAD_BYTES:
        logger.warning("Upload rejected: file exceeds 10 MB limit")
        raise HTTPException(status_code=413, detail="Upload exceeds the 10 MB limit.")
        
    return content
