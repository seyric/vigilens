class ContextBuilder:

    def build(self, results):

        context = []

        context.append(
            "===== Retrieved Investigation Records =====\n"
        )

        for i, (score, record) in enumerate(results, start=1):

            context.append(
                f"Record {i}"
            )

            context.append(
                f"Similarity: {score:.4f}"
            )

            context.append(
                 f"Source: {record.get('source', 'Unknown')}"
            )

            if "chunk_id" in record:
                context.append(
                    f"Chunk: {record['chunk_id']}"
                )

            context.append(
                "Content:"
            )

            context.append(
        record.get("text", "")
    )

            context.append(
                "\n---------------------------------\n"
            )

        return "\n".join(context)


context_builder = ContextBuilder()