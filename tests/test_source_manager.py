from app.rag.retriever import retriever
from app.rag.source_manager import source_manager

query = "motorcycle burglary"

results = retriever.retrieve(query)

sources = source_manager.build_sources(results)

print("\n========== SOURCES ==========\n")

for source in sources:

    print(source)

print("\n=============================")