import os
import sys
from pathlib import Path

import uvicorn

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

if getattr(sys, "frozen", False):
    base_dir = Path(sys.executable).resolve().parent
    for candidate in (base_dir, ROOT_DIR):
        if str(candidate) not in sys.path:
            sys.path.insert(0, str(candidate))

from backend.main import app


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("VIGILENS_PORT", "8000")))