# Vigilens – AI Module

> AI Developer: Lina Aggarwal  
> Version: 2.0

---

# Overview

The AI Module is the intelligence engine of **Vigilens**, an AI-powered Crime Investigation Platform.

It assists law enforcement officers by extracting information from FIRs, retrieving relevant case information, predicting crime hotspots, detecting suspicious crime patterns, and generating professional investigation reports.

---

# AI Workflow

```
Officer Request
        │
        ▼
AI Orchestrator
        │
        ▼
AI Router
        │
 ┌──────┼──────────────┐
 ▼      ▼              ▼
Investigation     Prediction     Report
Agent             Agent          Agent
        │
        ▼
RAG Engine / ML Engine
        │
        ▼
Gemini
        │
        ▼
Professional Response
```

---

# Features

## OCR Pipeline

- Image OCR
- PDF OCR
- Text Extraction
- Unified Document Loader

---

## AI FIR Extraction

Extracts structured information from FIR documents.

Features:

- FIR Number
- Crime Type
- Suspect
- Vehicle
- Location
- AI Summary
- Confidence Score

---

## RAG Engine

Provides intelligent investigation using Retrieval-Augmented Generation.

Components:

- Document Loader
- Chunking
- Metadata
- Embeddings
- Custom Vector Store
- Retriever
- Context Builder
- Prompt Builder

---

## Crime Intelligence

### Hotspot Prediction

Predicts high-risk crime locations.

Returns:

- Highest Risk Area
- Crime Count
- Risk Score
- Risk Level
- Confidence
- Explanation

---

### Explainability

Explains why a prediction was generated.

---

### Modus Operandi Anomaly Detection

Detects suspicious crime patterns based on historical data.

---

## Investigation Agent

Responsible for:

- FIR Search
- Case Investigation
- Crime Analysis

---

## Prediction Agent

Responsible for:

- Crime Hotspot Prediction
- Risk Assessment
- Explainability

---

## Report Agent

Responsible for generating professional investigation reports.

---

## AI Router

Routes officer requests to the correct AI agent.

---

## AI Orchestrator

Coordinates the complete AI workflow.

---

# Project Structure

```
app/

├── agents/
├── core/
├── ml/
├── prompts/
├── rag/
├── services/
└── utils/

tests/

docs/

data/
```

---

# Technology Stack

### AI

- Google Gemini API
- Prompt Engineering
- Retrieval-Augmented Generation (RAG)

### OCR

- Tesseract OCR
- PyMuPDF
- Pillow

### Machine Learning

- Pandas
- NumPy

### Storage

- JSON
- Custom Vector Store

---

# Running the Module

## Activate Virtual Environment

```bash
.venv\Scripts\activate
```

---

## Run Investigation

```bash
python -m tests.test_investigation_agent
```

---

## Run Prediction

```bash
python -m tests.test_prediction_agent
```

---

## Run Report Generation

```bash
python -m tests.test_report_agent
```

---

## Run Full AI Pipeline

```bash
python -m tests.test_ai_pipeline
```

---

# Entry Point

The backend should communicate with the AI module through:

```python
from app.agents.ai_orchestrator import ai_orchestrator

response = ai_orchestrator.process(query)
```

The AI Orchestrator automatically selects the appropriate AI agent and returns the final response.

---

# Current Status

| Module | Status |
|---------|--------|
| OCR | ✅ |
| AI Extraction | ✅ |
| RAG Engine | ✅ |
| Investigation Agent | ✅ |
| Prediction Agent | ✅ |
| Report Agent | ✅ |
| AI Router | ✅ |
| AI Orchestrator | ✅ |
| Explainability | ✅ |
| Anomaly Detection | ✅ |

---

# Future Enhancements

- Graph Agent (Neo4j)
- Criminal Network Analysis
- Crime Forecasting
- Voice Investigation Assistant
- Live GIS Mapping
- CCTV Integration
- Real-time Crime Alerts
- Multi-language Support

---

# Module Owner

**Lina Aggarwal**

AI Developer

Vigilens Project