from app.services.embedding_service import embedding_service

text = """
FIR Number: FIR-001

Crime Type: Burglary

Location: Connaught Place

A suspect wearing a black hoodie escaped on a motorcycle.
"""

embedding = embedding_service.create_embedding(text)

print("\n========== EMBEDDING ==========\n")
print(f"Vector Length : {len(embedding)}")
print(f"First 10 Values: {embedding[:10]}")
print("\n===============================")