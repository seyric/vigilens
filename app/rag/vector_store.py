import json
from pathlib import Path

import numpy as np


class VectorStore:

    def __init__(self):

        self.records = []

        self.store_path = Path("data/vector_store/store.json")

    def add(
        self,
        record
    ):

        self.records.append(record)

    def search(
        self,
        query_embedding,
        top_k=3
    ):

        results = []

        query = np.array(query_embedding)

        for record in self.records:

            embedding = np.array(record["embedding"])

            similarity = np.dot(query, embedding) / (
                np.linalg.norm(query)
                * np.linalg.norm(embedding)
            )

            results.append(
                (
                    similarity,
                    record
                )
            )

        results.sort(
            reverse=True,
            key=lambda x: x[0]
        )

        return results[:top_k]

    def save(self):

        self.store_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        with open(
            self.store_path,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                self.records,
                f,
                indent=4
            )

    def load(self):

        if self.store_path.exists():

            with open(
                self.store_path,
                "r",
                encoding="utf-8"
            ) as f:

                self.records = json.load(f)

    def clear(self):

        self.records = []


vector_store = VectorStore()