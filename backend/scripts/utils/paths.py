import os

# Project Root
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))
    )
)

# Dataset Folder
DATASET_DIR = os.path.join(BASE_DIR, "datasets")

# Lookup Folder
LOOKUP_DIR = os.path.join(DATASET_DIR, "lookup")

os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(LOOKUP_DIR, exist_ok=True)