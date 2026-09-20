# AI Crime Pattern Analyzer

`POST /api/crime-pattern/upload` accepts an authenticated multipart `file` upload (PDF, PNG, JPG, JPEG, TXT; 10 MB maximum). It extracts text in memory, identifies crime entities, searches scoped records, and returns exact and RapidFuzz similarity matches. Gemini enrichment is optional, cached, and never generates SQL.

```bash
curl -X POST http://localhost:8000/api/crime-pattern/upload -H "Authorization: Bearer <access-token>" -F "file=@incident.pdf;type=application/pdf"
```

```json
{"success":true,"filename":"incident.pdf","parsed_data":{"name":["Ramesh Kumar"],"phone":["9876543210"],"vehicle":["KA01AB1234"],"fir_no":["102/2024"],"crime_type":["Cyber Fraud"]},"matched_records":{"persons":[],"vehicles":[],"fir":[],"cases":[],"evidence":[]},"similar_matches":[],"ai_summary":null,"processing_time_ms":42}
```

Structure: `backend/crime_pattern/{controllers,routes,schemas,services,utils,parsers,ocr}`. Required packages in both manifests: `python-multipart`, `PyMuPDF`, `easyocr`, `rapidfuzz`, `spacy`, and `google-genai`. For spaCy NER, optionally run `python -m spacy download en_core_web_sm`.
