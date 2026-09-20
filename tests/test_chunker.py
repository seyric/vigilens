from app.rag.chunker import text_chunker

sample = """
This is a sample investigation report.
""" * 200

chunks = text_chunker.split(sample)

print(f"Total Chunks: {len(chunks)}")

for i, chunk in enumerate(chunks):

    print(f"\nChunk {i+1}")

    print(chunk[:100])