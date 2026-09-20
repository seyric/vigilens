# Vigilens - Sprint 5 Design Document

## Objective

Sprint 5 turns the data platform into a final prototype delivery layer. The goal is to prepare every dataset that downstream frontend, backend, AI, and Neo4j consumers need without building those consuming systems yet.

## Delivered Scope

- Dashboard analytics datasets for total crimes, active cases, solved cases, pending cases, arrest rate, high-risk districts, category mix, and temporal trends
- District analytics for every Karnataka district, including crime density, growth, solved vs. active counts, and risk score
- GIS-ready outputs including heatmap rows, coordinate datasets, marker rows, cluster summaries, and GeoJSON exports
- Trend-engine datasets for monthly, yearly, seasonal, category, district, and officer comparisons
- Neo4j-ready node and relationship exports for crime graph ingestion
- AI-ready clean text, metadata, RAG-style records, and structured summaries
- Backend-ready datasets for dashboard, search, timeline, and heatmap consumers
- Query optimization guidance with indexes, materialized view SQL, grouped queries, filtering examples, and benchmark notes

## Not Included

- FastAPI endpoints
- Frontend screens or dashboards
- Machine learning training or inference
- Live Neo4j ingestion jobs

## Verification

- `tests/test_delivery/test_sprint5.py` validates the manifest content and generated report files.
- The exported files are written to `reports/sprint5/` when the delivery layer is executed.

