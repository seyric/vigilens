from app.rag.retriever import retriever
from app.rag.context_builder import context_builder

query = "motorcycle burglary"

results = retriever.retrieve(query)

context = context_builder.build(results)

print("\n========== CONTEXT ==========\n")

print(context)

print("\n=============================")