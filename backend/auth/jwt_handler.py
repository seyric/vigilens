# JWT Handler: token creation, verification, and private decoding.
# create_access_token: signs JWT with sub converted to string; generates exp if missing.
# verify_access_token: validates signature and expiration, casts sub to int.
# _decode_token: private function to decode JWT payload without verification (testing/debugging only).

import os
from datetime import datetime, timedelta, timezone
import jwt
from dotenv import load_dotenv

# pyrefly: ignore [missing-import]
from backend.auth.models import TokenPayload
# pyrefly: ignore [missing-import]
from backend.auth.exceptions import InvalidTokenError, ExpiredTokenError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not configured.")

ALGORITHM = os.getenv("ALGORITHM", "HS256")

try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
except ValueError:
    ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(payload: TokenPayload) -> str:
    data = payload.model_dump()
    if data.get("exp") is None:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        data["exp"] = int(expire.timestamp())
    data["sub"] = str(data["sub"])
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token: str) -> TokenPayload:
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if "sub" in decoded_data:
            decoded_data["sub"] = str(decoded_data["sub"])
        return TokenPayload(**decoded_data)
    except jwt.ExpiredSignatureError as e:
        raise ExpiredTokenError("Token has expired") from e
    except jwt.PyJWTError as e:
        raise InvalidTokenError("Invalid token signature or format") from e
    except Exception as e:
        raise InvalidTokenError(f"Token decoding failed: {str(e)}") from e


def _decode_token(token: str) -> TokenPayload:
    try:
        decoded_data = jwt.decode(token, options={"verify_signature": False})
        if "sub" in decoded_data:
            decoded_data["sub"] = str(decoded_data["sub"])
        return TokenPayload(**decoded_data)
    except Exception as e:
        raise InvalidTokenError(f"Failed to decode unverified token: {str(e)}") from e
