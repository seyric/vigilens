from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User
from database.repositories import UserRepository
from backend.auth.models import (
    LoginRequest,
    LoginResponse,
    TokenResponse,
    TokenPayload
)
from backend.auth.exceptions import (
    InvalidCredentialsError,
    InactiveUserError
)
from backend.auth.password import verify_password
from backend.auth.jwt_handler import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.auth.dependencies import map_db_user_to_current_user

auth_router = APIRouter(prefix="/auth", tags=["authentication"])


@auth_router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    """Authenticate an officer and generate a JWT access token.

    Args:
        request: The login request payload containing username and password.
        db: The database session dependency.

    Returns:
        A LoginResponse containing user session information and the access token.

    Raises:
        HTTPException: 401 for invalid credentials or 403 for inactive accounts.
    """
    try:
        # 1. Retrieve user from database via repository
        user_repo = UserRepository(db)
        db_user = user_repo.get_by_username(request.username)
        if not db_user:
            raise InvalidCredentialsError("Invalid username or password")

        # 2. Verify password hash using backend/auth/password.py and ORM User model contract
        if not db_user.password_hash or not verify_password(request.password, db_user.password_hash):
            raise InvalidCredentialsError("Invalid username or password")

        # 3. Verify rank and district
        if db_user.officer and request.rank:
            if db_user.officer.rank.lower() != request.rank.strip().lower():
                raise InvalidCredentialsError("Invalid rank or district verification")

        district_name = None
        if db_user.district:
            district_name = db_user.district.district_name
        elif db_user.officer and db_user.officer.district:
            district_name = db_user.officer.district.district_name
            
        if district_name and request.district:
            if district_name.lower() != request.district.strip().lower():
                raise InvalidCredentialsError("Invalid rank or district verification")

        # 3. Check if user is active using ORM User model contract
        if not db_user.is_active:
            raise InactiveUserError("User account is inactive")

        # 4. Map user to CurrentUser
        current_user = map_db_user_to_current_user(db_user)

        # 5. Create access token payload and JWT
        payload = TokenPayload(
            sub=current_user.id,
            role_id=current_user.role.value,
            district_id=current_user.district_id,
            station_id=current_user.station_id
        )
        access_token = create_access_token(payload)
        expires_in_seconds = ACCESS_TOKEN_EXPIRE_MINUTES * 60

        return LoginResponse(
            user=current_user,
            token=TokenResponse(
                access_token=access_token,
                token_type="Bearer",
                expires_in=expires_in_seconds
            )
        )
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except InactiveUserError as e:
        raise HTTPException(status_code=403, detail=str(e))

