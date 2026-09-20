from fastapi import FastAPI, APIRouter
from fastapi.responses import JSONResponse

from database.connection import Base, engine
from backend.auth.router import auth_router
from backend.admin.router import admin_router
from backend.auth.exceptions import (
    InvalidTokenError,
    ExpiredTokenError,
    InactiveUserError,
    InsufficientPermissionError
)
from backend.scripts.database.seed_users import seed_users

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Vigilens API Gateway",
    description="Vigilens investigation and intelligence services",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers for Auth Exception mapping
@app.exception_handler(InvalidTokenError)
@app.exception_handler(ExpiredTokenError)
def invalid_token_handler(request, exc):
    return JSONResponse(status_code=401, content={"detail": str(exc)})


@app.exception_handler(InactiveUserError)
def inactive_user_handler(request, exc):
    return JSONResponse(status_code=403, content={"detail": str(exc)})


@app.exception_handler(InsufficientPermissionError)
def insufficient_permission_handler(request, exc):
    return JSONResponse(status_code=403, content={"detail": str(exc)})


from backend.core.router import core_router
from backend.analytics.router import analytics_router
from backend.ai.router import ai_router, translate_text, TranslateRequest
from backend.crime_pattern.routes.router import crime_pattern_router
from backend.osint.router import osint_router
from backend.osint.services.live_store import start_scheduler, stop_scheduler

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(core_router)
api_router.include_router(analytics_router)
api_router.include_router(ai_router)
api_router.include_router(osint_router)

app.include_router(api_router)
app.include_router(crime_pattern_router)

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    try:
        seed_users()
    except Exception:
        pass
    start_scheduler()

@app.on_event("shutdown")
async def shutdown_event():
    stop_scheduler()


@app.post("/api/translate", tags=["ai"])
def translate(request: TranslateRequest):
    """Public translation endpoint used by the multilingual UI."""
    return translate_text(request)


@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Vigilens API Gateway"}
