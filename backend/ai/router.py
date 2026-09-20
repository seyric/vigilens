from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.connection import get_db
from backend.auth.dependencies import get_current_active_user
from backend.auth.models import CurrentUser
from backend.ai.service import ai_service
from backend.ai.translation_service import translation_service

ai_router = APIRouter(prefix="/ai", tags=["ai"])

# ── Pydantic Request Contracts ───────────────────────────────────────────────

class OCRRequest(BaseModel):
    image_path: str


class AssistantRequest(BaseModel):
    question: str


class ReportRequest(BaseModel):
    fir_id: str

class TranslateRequest(BaseModel):
    text: str
    sourceLanguage: str
    targetLanguage: str

class DigitalEvidenceRequest(BaseModel):
    evidence_id: str

class VoiceSearchRequest(BaseModel):
    audio_base64: str

class PatternSimilarityRequest(BaseModel):
    fir_id: str


# ── AI Endpoints ─────────────────────────────────────────────────────────────

@ai_router.post("/ocr")
def perform_ocr(
    request: OCRRequest,
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Extract text content from an image file path (with LLM fallback)."""
    text = ai_service.perform_ocr(file_path=request.image_path)
    return {"image_path": request.image_path, "extracted_text": text}


@ai_router.post("/assistant")
def ask_assistant(
    request: AssistantRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Consult the AI Assistant with a natural language query about cases."""
    response = ai_service.ask_assistant(db=db, user=current_user, question=request.question)
    return {"question": request.question, "response": response}


@ai_router.post("/report")
def generate_report(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Generate a highly structured investigative report summary for a specific FIR case."""
    report = ai_service.generate_report(db=db, user=current_user, fir_id=request.fir_id)
    return {"fir_id": request.fir_id, "report": report}


@ai_router.post("/translate")
def translate_text(
    request: TranslateRequest,
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """Multilingual AI: Translate text into a target language."""
    translated_text = translation_service.translate_text(
        request.text,
        request.sourceLanguage,
        request.targetLanguage,
    )
    return {"translatedText": translated_text}


@ai_router.post("/analyze-digital-evidence")
def analyze_digital_evidence(
    request: DigitalEvidenceRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """Digital Intelligence Analyzer: Analyze CDR, IP logs, or device metadata."""
    analysis = ai_service.analyze_digital_evidence(db, current_user, request.evidence_id)
    return {"evidence_id": request.evidence_id, "analysis": analysis}


@ai_router.post("/voice-search")
def voice_search(
    request: VoiceSearchRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """Voice Search: Transcribe audio to text and perform a search query."""
    results = ai_service.voice_search(db, current_user, request.audio_base64)
    return results


@ai_router.post("/pattern-similarity")
def pattern_similarity(
    request: PatternSimilarityRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """AI Crime Pattern Similarity: Find linked cases based on MO and description."""
    similar_cases = ai_service.pattern_similarity(db, current_user, request.fir_id)
    return {"fir_id": request.fir_id, "similar_cases": similar_cases}
