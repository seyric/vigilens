from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service
from app.services.similarity_service import similarity_service
from app.services.gemini_service import gemini_service


class InvestigationAssistant:

 def investigate(self, question: str):

    query_embedding = embedding_service.create_embedding(question)

    documents = vector_service.load()

    scored_documents = []

    for item in documents:

        score = similarity_service.cosine_similarity(
            query_embedding,
            item["embedding"]
        )

        scored_documents.append(
            {
                "score": score,
                "document": item["document"]
            }
        )

    scored_documents.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    top_cases = scored_documents[:3]

    context = "\n\n".join(
        case["document"]
        for case in top_cases
    )

    prompt = f"""
You are Vigilens, an intelligent police investigation assistant.

Use ONLY the investigation records below to answer the officer's question.

Investigation Records:

{context}

Officer Question:

{question}
"""

    answer = gemini_service.ask(prompt)

    return {
        "matches": top_cases,
        "answer": answer
    }

investigation_assistant = InvestigationAssistant()