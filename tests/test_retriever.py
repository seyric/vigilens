from app.rag.retriever import retriever

query = "motorcycle burglary"

results = retriever.retrieve(
    query,
    top_k=3
)

print("\n========== RETRIEVER ==========\n")

for score, record in results:

    print(f"Similarity: {score:.4f}")

    print(record)

    print()

print("================================")