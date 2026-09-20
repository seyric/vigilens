# FastAPI dependencies for authentication and authorization.
# get_current_user: extracts JWT, verifies it, and returns CurrentUser.
# get_current_active_user: ensures current user is active.
# require_role_or_higher: helper function for role requirements.
# require_system_admin, require_state_admin, require_district_admin,
# require_station_officer, require_investigating_officer: role requirement dependencies.
# TODO: Future FastAPI global exception handlers will translate authentication/authorization
# exceptions (e.g. ExpiredTokenError, InvalidTokenError, InactiveUserError,
# InsufficientPermissionError) into appropriate HTTP status codes (401 Unauthorized, 403 Forbidden).

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User
from database.repositories import UserRepository
from backend.auth.jwt_handler import verify_access_token
from backend.auth.models import CurrentUser, Roles
from backend.auth.exceptions import InactiveUserError, InsufficientPermissionError, InvalidTokenError
from backend.auth.role_mapper import map_db_role_to_auth_role

security = HTTPBearer()


def map_db_user_to_current_user(db_user: User) -> CurrentUser:
    db_role_name = db_user.role.role_name if db_user.role else None
    auth_role = map_db_role_to_auth_role(db_role_name)

    return CurrentUser(
        id=db_user.user_id,
        role=auth_role,
        district_id=db_user.district_id,
        station_id=db_user.station_id,
        is_active=db_user.is_active
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> CurrentUser:
    token = credentials.credentials
    payload = verify_access_token(token)
    
    user_repo = UserRepository(db)
    db_user = user_repo.get(User, str(payload.sub))
    if not db_user:
        raise InvalidTokenError("User not found")
        
    return map_db_user_to_current_user(db_user)


def get_current_active_user(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if not user.is_active:
        raise InactiveUserError("User account is inactive")
    return user


def require_role_or_higher(required_role: Roles):
    def dependency(user: CurrentUser = Depends(get_current_active_user)) -> CurrentUser:
        if user.role.value > required_role.value:
            raise InsufficientPermissionError(
                f"Access denied. Requires role '{required_role.name}' or higher."
            )
        return user
    return dependency


require_system_admin = require_role_or_higher(Roles.SYSTEM_ADMIN)
require_state_admin = require_role_or_higher(Roles.STATE_ADMIN)
require_district_admin = require_role_or_higher(Roles.DISTRICT_SUPERINTENDENT)
require_station_officer = require_role_or_higher(Roles.STATION_HOUSE_OFFICER)
require_investigating_officer = require_role_or_higher(Roles.INVESTIGATING_OFFICER)