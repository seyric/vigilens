from app.services.embedding_service import embedding_service
from app.services.vector_service import vector_service


class Retriever:

    def retrieve(
        self,
        query,
        top_k=3
    ):

        query_embedding = embedding_service.create_embedding(
            query
        )

        results = vector_service.search(
            query_embedding,
            top_k
        )

        return results


retriever = Retriever()