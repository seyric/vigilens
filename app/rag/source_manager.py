class SourceManager:

    def build_sources(self, results):

        sources = []

        for _, record in results:

            document = record.get(
                "source",
                record.get(
                    "document",
                    "Unknown Document"
                )
            )

            chunk = record.get(
                "chunk_id",
                "N/A"
            )

            sources.append(
                {
                    "document": document,
                    "chunk": chunk
                }
            )

        return sources


source_manager = SourceManager()
