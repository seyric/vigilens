class MetadataManager:

    def create_metadata(
        self,
        chunks,
        document_name
    ):

        documents = []

        for i, chunk in enumerate(chunks):

            documents.append(
                {
                    "document": document_name,
                    "chunk_id": i + 1,
                    "text": chunk
                }
            )

        return documents


metadata_manager = MetadataManager()