from dotenv import load_dotenv
import os

# Load variables from the .env file, overriding existing env vars
load_dotenv(override=True)

class Settings:
    AI_PROVIDER = os.getenv("AI_PROVIDER", "ollama")
    OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
    OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_API_KEY_2 = os.getenv("GEMINI_API_KEY_2")
    GEMINI_API_KEY_3 = os.getenv("GEMINI_API_KEY_3")
    HYBRID_SENSITIVE_TASKS = os.getenv("HYBRID_SENSITIVE_TASKS", "local")
    SEED_DEV_USERS = os.getenv("SEED_DEV_USERS", "false").lower() == "true"

settings = Settings()