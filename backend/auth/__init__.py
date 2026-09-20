from backend.auth.router import auth_router
from backend.auth.password import hash_password, verify_password
from backend.auth.jwt_handler import create_access_token, verify_access_token
from backend.auth.permissions import (
    has_permission,
    can_access_district,
    can_access_station,
    can_manage_users,
    can_view_case
)
from backend.auth.dependencies import (
    get_current_user,
    get_current_active_user,
    require_system_admin,
    require_state_admin,
    require_district_admin,
    require_station_officer,
    require_investigating_officer
)
from backend.auth.models import (
    Roles,
    Permission,
    TokenPayload,
    CurrentUser,
    LoginRequest,
    TokenResponse,
    LoginResponse
)
from backend.auth.exceptions import (
    AuthError,
    InvalidTokenError,
    ExpiredTokenError,
    InvalidCredentialsError,
    InactiveUserError,
    InsufficientPermissionError
)

__all__ = [
    "auth_router",
    "hash_password",
    "verify_password",
    "create_access_token",
    "verify_access_token",
    "has_permission",
    "can_access_district",
    "can_access_station",
    "can_manage_users",
    "can_view_case",
    "get_current_user",
    "get_current_active_user",
    "require_system_admin",
    "require_state_admin",
    "require_district_admin",
    "require_station_officer",
    "require_investigating_officer",
    "Roles",
    "Permission",
    "TokenPayload",
    "CurrentUser",
    "LoginRequest",
    "TokenResponse",
    "LoginResponse",
    "AuthError",
    "InvalidTokenError",
    "ExpiredTokenError",
    "InvalidCredentialsError",
    "InactiveUserError",
    "InsufficientPermissionError"
]

