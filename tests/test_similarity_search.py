from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service
from app.services.similarity_service import similarity_service

query = "Find burglary cases involving motorcycles."

query_embedding = embedding_service.create_embedding(query)

documents = vector_service.load()

best_score = -1
best_document = None

for item in documents:
    score = similarity_service.cosine_similarity(
        query_embedding,
        item["embedding"]
    )

    if score > best_score:
        best_score = score
        best_document = item["document"]

print("\n========== SEARCH RESULT ==========\n")
print(f"Similarity Score: {best_score:.4f}\n")
print(best_document)
print("\n===================================")