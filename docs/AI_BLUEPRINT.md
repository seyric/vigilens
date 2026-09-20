# Vigilens – AI Engineering Blueprint

> Version: 2.0  
> Module Owner: Lina Aggarwal (AI Developer)  
> Status: AI Module Completed (Phase 1)  
> Project: Vigilens – Crime Investigation Platform

---

# Vision

Vigilens is an AI-powered Crime Investigation Platform designed to assist law enforcement officers in analyzing crime cases, retrieving relevant information, predicting crime hotspots, detecting suspicious patterns, and generating professional investigation reports.
The AI module serves as the intelligence engine of the entire platform.

# AI Philosophy
Gemini is **not** the AI system.
Gemini is only one component of the AI Engine.

The AI Engine is responsible for:
- Understanding officer requests
- Selecting the appropriate AI module
- Retrieving relevant information
- Running machine learning models
- Generating professional responses

# AI Architecture
                    Officer Request
                           │
                    AI Orchestrator
                           │
                    AI Router
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
 Investigation Agent   Prediction Agent   Report Agent
        │                  │                  │
        └──────────────┬───┴──────────────────┘
                       ▼
              RAG Engine & ML Engine
                       │
                     Gemini
                       │
              Professional Response

# AI Module Responsibilities

The AI module is responsible for:
- OCR & Document Understanding
- FIR Information Extraction
- Crime Investigation using RAG
- Crime Hotspot Prediction
- Risk Assessment
- Explainable AI
- Modus Operandi Anomaly Detection
- Investigation Report Generation

# RAG Pipeline
PDF / Image
↓
OCR
↓
Document Loader
↓
Text Chunking
↓
Metadata Generation
↓
Embeddings
↓
Custom Vector Store
↓
Retriever
↓
Context Builder
↓
Prompt Builder
↓
Gemini
↓
Investigation Response

# Machine Learning Pipeline
Crime Dataset
↓
Data Cleaning
↓
Hotspot Analysis
↓
Risk Score Calculation
↓
Explainability Service
↓
Anomaly Detection
↓
Prediction Agent

# AI Components

## OCR Service
Responsible for:
- Image OCR
- PDF OCR
- Text Extraction
- Unified Document Loading

## AI Extraction
Responsible for:
- FIR Number Extraction
- Crime Type Detection
- Suspect Detection
- Vehicle Detection
- Location Detection
- Confidence Score
- AI Summary Generation

## RAG Engine
Responsible for:
- Document Loading
- Chunk Creation
- Metadata Management
- Embedding Generation
- Vector Storage
- Similarity Search
- Context Building

## Investigation Agent
Responsible for:
- FIR Search
- Case Analysis
- Crime Summaries
- Evidence Retrieval

## Prediction Agent
Responsible for:
- Crime Hotspot Prediction
- Highest Risk Area
- Risk Score
- Confidence Score
- Prediction Explanation

## Explainability Service
Responsible for:
- Human-readable prediction explanation
- Model reasoning
- Risk interpretation

## Anomaly Detector
Responsible for:
- Modus Operandi anomaly detection
- Suspicious pattern identification
- Rare case detection

## Report Agent
Responsible for:
- Investigation Reports
- Case Summaries
- Recommendation Generation

## AI Router
Responsible for:
- Understanding officer intent
- Selecting the appropriate AI Agent

## AI Orchestrator
Responsible for:
- Coordinating AI workflow
- Managing AI agents
- Returning final responses

# Technology Stack

## AI
- Google Gemini API
- Prompt Engineering
- Retrieval-Augmented Generation (RAG)

## OCR
- Tesseract OCR
- PyMuPDF
- Pillow

## Machine Learning
- Pandas
- NumPy

## Storage
- JSON
- Custom Vector Store

## Development
- Python
- Git
- FastAPI (Backend Integration)

# Sprint Progress

## Sprint 1 – Foundation ✅
Completed
- Gemini Integration
- Configuration
- Logging
- Model Manager

## Sprint 2 – Document Intelligence ✅
Completed
- OCR Pipeline
- AI Extraction
- Document Loader
- Chunking
- Metadata
- Embeddings
- Custom Vector Store
- Retriever
- Context Builder
- Prompt Builder

## Sprint 3 – Crime Intelligence ✅
Completed
- Hotspot Prediction
- Risk Score
- Confidence Score
- Explainability
- Anomaly Detection

## Sprint 4 – AI Agents ✅
Completed
- Investigation Agent
- Prediction Agent
- Report Agent
- AI Router
- AI Orchestrator

## Sprint 5 – Integration 🔄
In Progress
- Backend Integration
- API Integration
- End-to-End Testing
- Documentation
- Deployment

# Engineering Principles
- Single Responsibility Principle
- Modular Architecture
- Reusable AI Components
- Clean Code
- No Hardcoded Secrets
- Git-friendly Development
- Easy Backend Integration
- Scalable AI Design

# Current AI Features
✅ OCR Pipeline
✅ AI FIR Extraction
✅ Retrieval-Augmented Generation
✅ Crime Investigation Assistant
✅ Crime Hotspot Prediction
✅ Risk Assessment
✅ Explainable AI
✅ Modus Operandi Anomaly Detection
✅ Investigation Report Generation
✅ AI Router
✅ AI Orchestrator
---

# Future Scope
- Graph Agent (Neo4j)
- Criminal Network Analysis
- Crime Forecasting
- Voice Investigation Assistant
- Real-time Crime Alerts
- CCTV Integration
- Live GIS Mapping
- Multi-language Support
- Explainable AI Dashboard

# Current Project Status
**AI Module:** ✅ Feature Complete
**Backend Integration:** 🔄 Pending
**Deployment:** ⏳ Planned
**Version:** 2.0