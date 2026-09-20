import json
from pathlib import Path

import numpy as np


class VectorService:

    def __init__(self):

        self.db_path = Path("data/knowledge_base/firs/vectors.json")

        self.db_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        if not self.db_path.exists():
            self.db_path.write_text("[]", encoding="utf-8")

    def save(
        self,
        text: str,
        embedding: list,
        metadata: dict = None
    ):

        data = self.load()

        record = {
            "id": f"chunk_{len(data)+1}",
            "source": "Unknown",
            "chunk_id": len(data)+1,
            "text": text,
            "embedding": embedding
        }

        if metadata:
            record.update(metadata)

        data.append(record)

        self.db_path.write_text(
            json.dumps(data, indent=4),
            encoding="utf-8"
        )

    def load(self):

        return json.loads(
            self.db_path.read_text(
                encoding="utf-8"
            )
        )

    def cosine_similarity(
        self,
        embedding1,
        embedding2
    ):

        embedding1 = np.array(embedding1)
        embedding2 = np.array(embedding2)

        denominator = (
            np.linalg.norm(embedding1)
            * np.linalg.norm(embedding2)
        )

        if denominator == 0:
            return 0

        return np.dot(
            embedding1,
            embedding2
        ) / denominator

    def search(
        self,
        query_embedding,
        top_k=3
    ):

        data = self.load()

        results = []

        for record in data:

            similarity = self.cosine_similarity(
                query_embedding,
                record["embedding"]
            )

            results.append(
                (
                    similarity,
                    record
                )
            )

        results.sort(
            key=lambda x: x[0],
            reverse=True
        )

        return results[:top_k]

    def clear(self):

        self.db_path.write_text(
            "[]",
            encoding="utf-8"
        )


vector_service = VectorService()