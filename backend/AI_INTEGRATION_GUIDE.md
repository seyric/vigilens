# AI Integration & Service Contracts Guide

Welcome to the Vigilens backend integration guide for AI engineers. This document defines the service boundary and execution contracts between the FastAPI REST layer and the underlying machine learning, OCR, RAG, and Large Language Model (Gemini) components.

---

## 🏗️ 1. Division of Responsibilities

To maintain clean architecture and code isolation, we enforce a strict separation of concerns:

### Backend Layer Responsibilities

- **Authentication & Security**: Validates JWT payloads and enforces RBAC/geographic scoping.
- **Routing & Validation**: Manages HTTP request parameters and Pydantic structural validation.
- **Service Orchestration**: Instantiates database connections, gathers raw data context, and invokes the AI service layer.

### AI Layer Responsibilities

- **OCR Processing**: Exposing document text parsing (Pytesseract engine management).
- **Gemini Prompt Engineering**: Defining system instructions, managing multi-modal generation parameters, and token window control.
- **RAG & Context Synthesis**: Converting database queries into coherent text prompts.
- **Predictions, Summaries, & Reports**: Formatting markdown outputs, predicting hotspots, and generating investigative briefs.

---

## 🛠️ 2. Core AI Feature Specifications

### A. Document OCR (`POST /ai/ocr`)

- **Execution Flow**:
  1. The backend receives a local image path string via JSON body.
  2. The service layer verifies the file exists on disk.
  3. The service calls `ocr_service.extract_text(image_path)` to attempt local Tesseract extraction.
  4. **Fallback Handler**: If the local Tesseract binary is missing or fails (e.g. `FileNotFoundError` or `TesseractNotFoundError`), the backend catches the error and executes a multimodal fallback query to Google Gemini. It opens the file as a PIL Image object and sends it alongside a specialized OCR prompt.
- **Input JSON Payload**:
  ```json
  {
    "image_path": "datasets/raw/images/sample_fir.jpg"
  }
  ```
- **Output Response Schema**:
  ```json
  {
    "image_path": "datasets/raw/images/sample_fir.jpg",
    "extracted_text": "Extracted text content..."
  }
  ```
- **Error Handling**:
  - **404 Not Found**: File does not exist on disk.
  - **500 Internal Server Error**: Occurs if both Tesseract extraction and the Gemini fallback fail. Returns details on both errors:
    `{"detail": "OCR failed. Local Tesseract OCR failed with: <error>. Multimodal Gemini Fallback failed with: <error>"}`

---

### B. AI Assistant Chat (`POST /ai/assistant`)

- **Execution Flow**:
  1. The user posts a question string.
  2. The backend queries the database for active cases (`FIR`) matching the user's role and geographic scope.
  3. The backend formats this list into a clean, text-based Case Context string.
  4. The backend injects the context into a pre-defined LLM System Prompt.
  5. The backend calls `gemini_service.ask(system_prompt)` and returns the assistant answer.
- **Context Injection Template**:

  ```text
  You are Vigilens, an expert criminal intelligence analyst and assistant...
  Geographic Scoped Case Context:
  - FIR Number: FIR-2026-001, Status: Registered, Severity: Medium, Complainant: Ravi, Details: ...

  User Question: {question}
  ```

- **Input JSON Payload**:
  ```json
  {
    "question": "Summarize active high-severity cases in my station."
  }
  ```
- **Output Response Schema**:
  ```json
  {
    "question": "Summarize active high-severity cases in my station.",
    "response": "Detailed markdown formatted response from LLM..."
  }
  ```

---

### C. Report Generation (`POST /ai/report`)

- **Execution Flow**:
  1. The user posts an `fir_id`.
  2. The backend verifies the case exists and is visible to the user.
  3. The backend joins related tables to compile an aggregate string representing all case attributes:
     - Case details (number, date, complainant, incident description).
     - Investigating officer (name, rank, badge).
     - Associated offenses (crimes description, categories, modus operandi).
     - Suspect demographics.
     - Evidence registry items.
  4. The backend compiles this data into a structured case profile and wraps it in a prompting template requesting a formal investigative report.
- **Report Formatting Expectations**:
  Gemini is expected to output clean Markdown structured into the following sections:
  1. `# Case Brief & Investigative Summary`
  2. `## Executive Summary & Case Status`
  3. `## Complainant Allegations & Incident Description`
  4. `## Offense Breakdown & Modus Operandi Analysis`
  5. `## Suspect Profiles & Relation Analysis`
  6. `## Evidence Chain of Custody & Analysis`
  7. `## Recommended Next Steps`
- **Input JSON Payload**:
  ```json
  {
    "fir_id": "fir-uuid-12345"
  }
  ```
- **Output Response Schema**:
  ```json
  {
    "fir_id": "fir-uuid-12345",
    "report": "# Case Brief & Investigative Summary\n..."
  }
  ```

---

## 📝 3. AI Service Contracts (Backend Interfaces)

The backend expects your custom AI service modules to conform to the following signatures:

### 1. Gemini Service Client Interface

- **Interface Class**: [GeminiService](../app/services/gemini_service.py)
- **Constructor**:
  - Initializes the `genai.Client` using `settings.GEMINI_API_KEY` loaded from environment variables.
  - Specifies model `gemini-flash-latest` (or newer `gemini-2.5-flash` variants).
- **Core Methods**:
  - `ask(prompt: str) -> str`
    - **Parameters**: `prompt` (string)
    - **Returns**: Text content response (string).
    - **Exceptions Raised**: `ValueError` (if key is missing), Google SDK communication errors.
    - **Timeout Expectation**: Requests must complete within **30 seconds**.

### 2. Document OCR Interface

- **Interface Class**: [OCRService](../app/services/ocr_service.py)
- **Core Methods**:
  - `extract_text(image_path: str) -> str`
    - **Parameters**: `image_path` (string)
    - **Returns**: Extracted text content (string).
    - **Exceptions Raised**: `FileNotFoundError` (if tesseract cmd path or image is invalid), `pytesseract.TesseractNotFoundError`.

---

## 🔮 4. Future AI Feature Integration Placeholders

The REST API Gateway contains architectural hooks ready for the following expansions:

### 1. Crime Hotspot Prediction

- **Goal**: Analyze time, date, and police coordinates to forecast high-density incident locations.
- **Expected Hook**:
  - `GET /analytics/predictions/hotspots?district_id={id}`
  - **AI Output Contract**: Array of GeoJSON points with probability weights.
  - _[TBD - AI Team to implement predictive clustering model]_

### 2. Suspect Recidivism / Risk Scoring

- **Goal**: Compute risk profiles for identified suspects based on offender histories.
- **Expected Hook**:
  - `GET /core/suspects/{suspect_id}/risk-score`
  - **AI Output Contract**: `{"suspect_id": str, "risk_score": float, "confidence": float}`
  - _[TBD - AI Team to implement scoring engine]_

### 3. Model Explainability

- **Goal**: Generate natural language explanations describing why a risk score or hotspot was predicted.
- **Expected Hook**:
  - `GET /analytics/explain?prediction_id={id}`
  - **AI Output Contract**: Description of feature importances and decision tree outputs.
  - _[TBD - AI Team to implement SHAP/LIME explanation wrappers]_

### 4. Modus Operandi Anomaly Detection

- **Goal**: Flags cases that deviate significantly from typical district offense patterns.
- **Expected Hook**:
  - `GET /analytics/anomalies`
  - **AI Output Contract**: List of anomalous FIR IDs with distance scores.
  - _[TBD - AI Team to implement Isolation Forest / autoencoder models]_
