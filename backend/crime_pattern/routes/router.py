"""Authenticated HTTP route for document crime-pattern analysis."""
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from backend.auth.dependencies import get_current_active_user
from backend.auth.models import CurrentUser
from backend.crime_pattern.controllers.upload_controller import crime_pattern_upload_controller
from backend.crime_pattern.schemas.contracts import CrimePatternResponse
from database.connection import get_db

crime_pattern_router = APIRouter(prefix="/api/crime-pattern", tags=["AI Crime Pattern Analyzer"])

@crime_pattern_router.post("/upload", response_model=CrimePatternResponse)
async def upload_crime_pattern_document(
    file: UploadFile = File(..., description="PDF, PNG, JPG, JPEG, or TXT evidence document"),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_active_user)
) -> CrimePatternResponse:
    """Extract indicators and return authorized related records."""
    return await crime_pattern_upload_controller.analyze(file, db, current_user)
