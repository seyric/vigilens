"""Thin upload controller for the AI Crime Pattern Analyzer."""
from time import perf_counter
from fastapi import HTTPException, UploadFile
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.auth.models import CurrentUser
from backend.crime_pattern.ocr.extractor import DocumentTextExtractor
from backend.crime_pattern.parsers.entity_parser import CrimeEntityParser
from backend.crime_pattern.schemas.contracts import CrimePatternResponse, ParsedCrimeData
from backend.crime_pattern.services.enrichment import GeminiEnricher
from backend.crime_pattern.services.search import CrimeRecordSearcher
from backend.crime_pattern.utils.uploads import read_upload
from utils.logger import logger

class CrimePatternUploadController:
    def __init__(self):
        self.extractor = DocumentTextExtractor()
        self.parser = CrimeEntityParser()
        self.enricher = GeminiEnricher()
        self.searcher = CrimeRecordSearcher()

    async def analyze(self, upload: UploadFile, db: Session, user: CurrentUser) -> CrimePatternResponse:
        started = perf_counter()
        filename = upload.filename or "upload"
        
        content = await read_upload(upload)
        text = self.extractor.extract(filename, content)
        if not text:
            logger.warning("No readable text extracted from upload: {}", filename)
            raise HTTPException(status_code=422, detail="No readable text was found in the uploaded document.")
            
        logger.info("Crime-pattern OCR/text extraction succeeded: {}", filename)
        parsed = self.parser.parse(text)
        logger.info("Crime-pattern parsing succeeded for file: {}", filename)

        # Optional Gemini enrichment
        additions, summary = self.enricher.enrich(text, parsed.model_dump_json())
        merged = parsed.model_dump()
        for key, values in additions.items():
            if key in merged and isinstance(values, list):
                merged[key] = list(dict.fromkeys([*merged[key], *map(str, values)]))

        parsed_data = ParsedCrimeData(**merged)
        
        try:
            records, similar = self.searcher.search(db, user, parsed_data)
        except SQLAlchemyError as error:
            logger.exception("Crime-pattern database failure for file: {}", filename)
            raise HTTPException(status_code=503, detail="Crime record search is temporarily unavailable.") from error

        processing_time = round((perf_counter() - started) * 1000)
        logger.info("Crime-pattern analysis completed in {}ms for file: {}", processing_time, filename)

        return CrimePatternResponse(
            success=True,
            filename=filename,
            parsed_data=parsed_data,
            matched_records=records,
            similar_matches=similar,
            ai_summary=summary,
            processing_time_ms=processing_time
        )

crime_pattern_upload_controller = CrimePatternUploadController()
