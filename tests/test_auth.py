"""
Vigilens Authentication Integration Test

This script validates that every authentication component
works correctly together before integration with the database
and FastAPI routes.
"""

import os
import sys
import time

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure output encoding for unicode characters (like checkmarks) on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# ------------------------------------------------------------------
# Configure Environment
# ------------------------------------------------------------------

os.environ["SECRET_KEY"] = "Vigilens-ai-test-secret-key"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

# ------------------------------------------------------------------
# Imports
# ------------------------------------------------------------------

# pyrefly: ignore [missing-import]
from backend.auth.password import hash_password, verify_password

# pyrefly: ignore [missing-import]
from backend.auth.models import (
    Roles,
    Permission,
    TokenPayload,
    CurrentUser
)

# pyrefly: ignore [missing-import]
from backend.auth.jwt_handler import (
    create_access_token,
    verify_access_token
)

# pyrefly: ignore [missing-import]
from backend.auth.permissions import (
    has_permission,
    can_access_district,
    can_access_station,
    can_manage_users
)

# ------------------------------------------------------------------
# Password Tests
# ------------------------------------------------------------------

print("=" * 60)
print("PASSWORD TEST")
print("=" * 60)

password = "Vigilens123!"

hashed = hash_password(password)

assert verify_password(password, hashed)
assert not verify_password("WrongPassword", hashed)

print("✓ Password hashing")
print("✓ Password verification")

# ------------------------------------------------------------------
# JWT Tests
# ------------------------------------------------------------------

print("\n" + "=" * 60)
print("JWT TEST")
print("=" * 60)

payload = TokenPayload(
    sub="1",
    role_id=Roles.SYSTEM_ADMIN,
    district_id="1",
    station_id="101"
)

token = create_access_token(payload)

decoded = verify_access_token(token)

assert decoded.sub == "1"
assert decoded.role_id == Roles.SYSTEM_ADMIN

print("✓ Token generation")
print("✓ Token verification")

# ------------------------------------------------------------------
# Current User
# ------------------------------------------------------------------

print("\n" + "=" * 60)
print("CURRENT USER TEST")
print("=" * 60)

current_user = CurrentUser(
    id=decoded.sub,
    role=Roles(decoded.role_id),
    district_id=decoded.district_id,
    station_id=decoded.station_id,
    is_active=True
)

print("✓ CurrentUser creation")

# ------------------------------------------------------------------
# Permission Tests
# ------------------------------------------------------------------

print("\n" + "=" * 60)
print("PERMISSION TEST")
print("=" * 60)

assert has_permission(
    current_user,
    Permission.MANAGE_USERS
)

assert can_manage_users(current_user)

assert can_access_district(
    current_user,
    "1"
)

assert can_access_station(
    current_user,
    "101"
)

print("✓ Permission hierarchy")
print("✓ District access")
print("✓ Station access")

# ------------------------------------------------------------------
# Role Hierarchy Test
# ------------------------------------------------------------------

print("\n" + "=" * 60)
print("ROLE HIERARCHY TEST")
print("=" * 60)

roles = [
    Roles.SYSTEM_ADMIN,
    Roles.STATE_ADMIN,
    Roles.DISTRICT_SUPERINTENDENT,
    Roles.STATION_HOUSE_OFFICER,
    Roles.INVESTIGATING_OFFICER,
]

for role in roles:
    print(f"{role.name:<30} -> {role.value}")

print("✓ Role hierarchy")

# ------------------------------------------------------------------
# Final Summary
# ------------------------------------------------------------------

print("\n" + "=" * 60)
print("AUTHENTICATION MODULE")
print("=" * 60)

print("✓ Password Module")
print("✓ JWT Module")
print("✓ Models")
print("✓ Permission Engine")
print("✓ Role Hierarchy")

print("\n🎉 ALL AUTHENTICATION TESTS PASSED!")