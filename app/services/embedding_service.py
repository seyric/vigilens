from google import genai

from app.core.config import settings
from app.core.model_manager import model_manager


class EmbeddingService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def create_embedding(self, text: str):
        response = self.client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
        )

        return response.embeddings[0].values


embedding_service = EmbeddingService()