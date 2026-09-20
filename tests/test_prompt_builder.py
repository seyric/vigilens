from app.rag.retriever import retriever
from app.rag.context_builder import context_builder
from app.prompts.prompt_builder import prompt_builder

query = "Find burglary cases involving motorcycles."

results = retriever.retrieve(query)

context = context_builder.build(results)

prompt = prompt_builder.build(
    query,
    context
)

print("\n========== PROMPT ==========\n")

print(prompt)

print("\n============================")