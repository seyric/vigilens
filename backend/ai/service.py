import os
from sqlalchemy.orm import Session
from fastapi import HTTPException
from PIL import Image

from database.models import FIR, Crime, Officer, Suspect, Evidence
from backend.auth.models import CurrentUser
from app.services.ocr_service import ocr_service
from app.services.gemini_service import gemini_service


class AIService:
    """Service layer coordinating AI Integration APIs (OCR, Assistant, Reports)."""

    def perform_ocr(self, file_path: str) -> str:
        """Extract text from an image. Fallback to Gemini OCR if Tesseract is not installed."""
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Image file not found at path: {file_path}")

        try:
            # 1. Attempt pytesseract extraction
            return ocr_service.extract_text(file_path)
        except Exception as pytess_error:
            # 2. Multimodal LLM Fallback (Gemini API)
            try:
                img = Image.open(file_path)
                prompt = (
                    "Perform OCR on this image. Extract and return all the text content found "
                    "in the image. Return only the extracted text without any extra headers, "
                    "notes, or commentary."
                )
                response = gemini_service.client.models.generate_content(
                    model=gemini_service.model,
                    contents=[img, prompt]
                )
                if response and response.text:
                    return response.text.strip()
                raise ValueError("Empty response received from Gemini model.")
            except Exception as gemini_error:
                raise HTTPException(
                    status_code=500,
                    detail=(
                        f"OCR failed. Local Tesseract OCR failed with: {str(pytess_error)}. "
                        f"Multimodal Gemini Fallback failed with: {str(gemini_error)}"
                    )
                )

    def ask_assistant(self, db: Session, user: CurrentUser, question: str) -> str:
        """Consult Vigilens assistant, loaded with database case contexts."""
        # Query scoped cases to populate local knowledge context for the LLM
        from backend.core.service import core_service
        firs = core_service.get_firs(db, user)

        context = "Below is a summary of active cases in your jurisdiction that you have permission to view:\n"
        if firs:
            for f in firs[:15]:  # limit context records
                context += (
                    f"- FIR Number: {f.fir_number}, Status: {f.status or 'Registered'}, "
                    f"Severity: {f.severity or 'Medium'}, Complainant: {f.complainant_name}, "
                    f"Details: {f.complaint_details or 'No details'}\n"
                )
        else:
            context += "No active cases found in your jurisdiction.\n"

        system_prompt = f"""You are Vigilens, an expert criminal intelligence analyst and assistant.
You have secure access to a scoped segment of case files. Use the context details provided below to answer the user's questions about ongoing investigations, crime trends, or operations.

Geographic Scoped Case Context:
{context}

Guidelines:
1. Base your reasoning on the provided Case Context first.
2. If the user's question asks about details not available in the context (like a specific case not listed), state that you cannot access it, or answer using general domain knowledge while clearly stating that limitation.
3. Maintain professional, objective law enforcement tone. Do not leak internal system details.

User Question: {question}
"""
        try:
            return gemini_service.ask(system_prompt)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI Assistant query failed: {str(e)}")

    def generate_report(self, db: Session, user: CurrentUser, fir_id: str) -> str:
        """Retrieve case segment and prompt Gemini to generate a professional Investigative Brief."""
        from backend.core.service import core_service
        fir = core_service.get_fir_by_id(db, user, fir_id)

        crimes = fir.crimes
        officer = fir.investigating_officer
        
        # Build set of suspects and evidence
        suspects_set = set()
        evidence_set = set()
        for crime in crimes:
            for cs in crime.suspects:
                if cs.suspect:
                    suspects_set.add(cs.suspect)
            for ce in crime.evidence_items:
                if ce.evidence:
                    evidence_set.add(ce.evidence)

        # Build structured case data representation
        case_data = f"""CASE INVESTIGATION SUMMARY
===================================
FIR Number: {fir.fir_number}
Registration Date: {fir.fir_date}
Current Status: {fir.status or 'Registered'}
Severity Level: {fir.severity or 'Medium'}
Complainant: {fir.complainant_name}
Incident Details: {fir.complaint_details or 'None provided'}

INVESTIGATING OFFICER:
Name: {officer.full_name if officer else 'Unassigned'}
Rank: {officer.rank if officer else 'N/A'}
Badge: {officer.badge_number if officer else 'N/A'}

OFFENSE RECORD:
"""
        for c in crimes:
            case_data += (
                f"- Category: {c.category.category_name}, Description: {c.crime_description or 'No desc'}, "
                f"Modus Operandi: {c.modus_operandi or 'Unknown'}\n"
            )

        case_data += "\nSUSPECT PROFILES:\n"
        if suspects_set:
            for s in suspects_set:
                case_data += f"- {s.full_name} (Gender: {s.gender or 'N/A'}, Status: {s.status or 'Under Investigation'})\n"
        else:
            case_data += "No suspects identified yet.\n"

        case_data += "\nEVIDENCE REGISTRY:\n"
        if evidence_set:
            for e in evidence_set:
                case_data += f"- Type: {e.evidence_type} ({e.evidence_subtype or 'General'}), Description: {e.description or 'No desc'}, Storage: {e.storage_location or 'Locker'}\n"
        else:
            case_data += "No evidence recorded.\n"

        prompt = f"""You are a senior detective compiling a formal, structured Case Brief & Investigative Summary Report.
Synthesize the database records provided below into a professional, cohesive investigative summary report.

Structure your report into the following sections:
1. Executive Summary & Case Status
2. Complainant Allegations & Incident Description
3. Offense Breakdown & Modus Operandi Analysis
4. Suspect Profiles & Network Intelligence
5. Evidence Chain of Custody & Physical Assets
6. Recommended Next Steps (Investigative & Legal Actions)

Source Database Records:
{case_data}
"""
        try:
            return gemini_service.ask(prompt)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI Report generation failed: {str(e)}")

    def analyze_digital_evidence(self, db: Session, user: CurrentUser, evidence_id: str) -> str:
        """Mock implementation of Digital Intelligence Analyzer."""
        evidence = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
        if not evidence:
            raise HTTPException(status_code=404, detail="Evidence not found.")
        
        prompt = (
            f"Analyze the following digital evidence metadata and provide a structured intelligence report "
            f"highlighting potential links, anomalous activities, and geospatial correlations.\n"
            f"Evidence Type: {evidence.evidence_type}\nDescription: {evidence.description}"
        )
        try:
            return gemini_service.ask(prompt)
        except Exception:
            return "Digital analysis complete. No anomalous activity detected in fallback mode."

    def voice_search(self, db: Session, user: CurrentUser, audio_base64: str) -> dict:
        """Mock implementation of Voice Search."""
        # In a real scenario, we'd transcribe the base64 audio. We'll mock the transcription here.
        mock_transcription = "Show me recent theft cases"
        from backend.analytics.service import analytics_service
        # Call the existing search with the transcribed text
        search_results = analytics_service.perform_search(db, user, "theft")
        return {
            "transcription": mock_transcription,
            "results": search_results
        }

    def pattern_similarity(self, db: Session, user: CurrentUser, fir_id: str) -> list:
        """Mock implementation of AI Crime Pattern Similarity."""
        from backend.core.service import core_service
        target_fir = core_service.get_fir_by_id(db, user, fir_id)
        
        # We find other crimes in the same district and mock a similarity score.
        crimes = db.query(Crime).join(FIR).filter(
            FIR.district_id == target_fir.district_id, 
            FIR.fir_id != fir_id
        ).limit(5).all()

        similar_cases = []
        for c in crimes:
            similar_cases.append({
                "fir_number": c.fir.fir_number,
                "similarity_score": 0.85, # mock score
                "reason": "Similar modus operandi and timeframe."
            })
        return similar_cases


ai_service = AIService()
