from app.rag.chunker import text_chunker
from app.rag.metadata_manager import metadata_manager

sample = """
This is a sample investigation report.
""" * 50

chunks = text_chunker.split(sample)

documents = metadata_manager.create_metadata(
    chunks,
    "sample_case.pdf"
)

for doc in documents:
    print(doc)