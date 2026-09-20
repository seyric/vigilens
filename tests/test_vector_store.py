from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service

document = """
FIR Number: FIR-001

Crime Type: Burglary

Location: Connaught Place

A suspect wearing a black hoodie escaped on a motorcycle.
"""

embedding = embedding_service.create_embedding(document)

vector_service.save(document, embedding)

print("\n✅ FIR stored successfully!")