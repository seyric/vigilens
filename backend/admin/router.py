from fastapi import APIRouter, Depends
from pydantic import BaseModel

from backend.auth.dependencies import require_system_admin
from backend.auth.models import CurrentUser
from backend.ai.provider import get_provider_status
from config.settings import get_settings
from database.connection import _manager

admin_router = APIRouter(prefix="/admin", tags=["administration"])


class ProviderUpdateRequest(BaseModel):
    provider: str


@admin_router.get("/status")
def get_admin_status(current_user: CurrentUser = Depends(require_system_admin)):
    settings = get_settings()
    return {
        "service": "Vigilens",
        "environment": settings.app_env,
        "database": "sqlite" if _manager.using_sqlite else "postgresql",
        "ai": get_provider_status(),
        "usb_key_policy": settings.usb_key_required,
    }


@admin_router.get("/providers")
def get_ai_providers(current_user: CurrentUser = Depends(require_system_admin)):
    return {"providers": get_provider_status()["supported"]}


@admin_router.post("/provider")
def set_ai_provider(
    payload: ProviderUpdateRequest,
    current_user: CurrentUser = Depends(require_system_admin),
):
    settings = get_settings()
    provider = payload.provider.strip().lower()
    if provider not in {
        "ollama",
        "gemini",
        "grok",
        "hybrid",
        "openai-compatible",
        "openai_compatible",
        "llamacpp",
        "llama.cpp",
        "vllm",
        "localai",
        "lmstudio",
        "open-webui",
    }:
        return {"updated": False, "message": "Unsupported provider."}
    settings.ai_provider = provider
    return {"updated": True, "provider": provider, "restart_required": True}
