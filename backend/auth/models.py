# Authentication models and enums for Vigilens.
# Roles: 1 (SYSTEM_ADMIN) to 5 (INVESTIGATING_OFFICER). Lower = higher authority.
# Permission: Action-oriented permissions.
# TokenPayload: Decoded JWT payload with no PII.
# CurrentUser: Authenticated user session.
# LoginRequest: Schema for login.
# TokenResponse: Token response payload.
# LoginResponse: Combined user info and token response.

from enum import Enum, IntEnum
from typing import Optional
from pydantic import BaseModel


class Roles(IntEnum):
    SYSTEM_ADMIN = 1
    STATE_ADMIN = 2
    DISTRICT_SUPERINTENDENT = 3
    STATION_HOUSE_OFFICER = 4
    INVESTIGATING_OFFICER = 5


class Permission(str, Enum):
    CREATE_CASE = "CREATE_CASE"
    UPDATE_CASE = "UPDATE_CASE"
    DELETE_CASE = "DELETE_CASE"
    VIEW_ANALYTICS = "VIEW_ANALYTICS"
    EXPORT_REPORT = "EXPORT_REPORT"
    MANAGE_USERS = "MANAGE_USERS"
    VIEW_ALL_DISTRICTS = "VIEW_ALL_DISTRICTS"
    VIEW_ASSIGNED_DISTRICT = "VIEW_ASSIGNED_DISTRICT"


class TokenPayload(BaseModel):
    sub: str
    role_id: int
    district_id: Optional[str] = None
    station_id: Optional[str] = None
    exp: Optional[int] = None


class CurrentUser(BaseModel):
    id: str
    role: Roles
    district_id: Optional[str] = None
    station_id: Optional[str] = None
    is_active: bool = True


class LoginRequest(BaseModel):
    username: str
    password: str
    rank: str
    district: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    expires_in: int


class LoginResponse(BaseModel):
    user: CurrentUser
    token: TokenResponse
