# Standalone Sprint B1 Authentication System Validation Test
# Executable with: python tests/test_auth_system.py

import os
import sys
import time
import jwt
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any

# Ensure project root is in the path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

# Configure environment variables if they are not already set
if not os.environ.get("SECRET_KEY"):
    os.environ["SECRET_KEY"] = "Vigilens-ai-system-validation-key-32-chars"
if not os.environ.get("ALGORITHM"):
    os.environ["ALGORITHM"] = "HS256"
if not os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"):
    os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

# Import database connection
from database.connection import get_session, engine
from database.models import User, Role, District, PoliceStation, Officer, Base
from database.repositories import UserRepository

# Import authentication components
from backend.auth.password import hash_password, verify_password
from backend.auth.jwt_handler import create_access_token, verify_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from backend.auth.models import Roles, Permission, TokenPayload, CurrentUser, LoginRequest, LoginResponse, TokenResponse
from backend.auth.permissions import has_permission, can_access_district, can_access_station
from backend.auth.exceptions import InvalidCredentialsError, InactiveUserError, InvalidTokenError, ExpiredTokenError, AuthError
from backend.auth.role_mapper import map_db_role_to_auth_role


class ValidationTester:
    def __init__(self):
        self.results: Dict[str, str] = {}
        self.reasons: Dict[str, str] = {}
        self.start_time = 0.0
        self.missing_dependencies: List[str] = []

    def start(self):
        self.start_time = time.time()
        print("=" * 60)
        print("VIGILENS AI AUTHENTICATION SYSTEM TEST")
        print("=" * 60)

    def log_result(self, name: str, passed: bool, reason: str = "", skipped: bool = False):
        if skipped:
            self.results[name] = "SKIP"
            self.reasons[name] = reason
            print(f"[SKIP] {name} - {reason}")
        elif passed:
            self.results[name] = "PASS"
            print(f"[PASS] {name}")
        else:
            self.results[name] = "FAIL"
            self.reasons[name] = reason
            print(f"[FAIL] {name} - {reason}")

    def finish(self):
        duration = time.time() - self.start_time
        print("\n" + "=" * 60)
        print("Sprint B1 Authentication Validation Summary")
        print("=" * 60)
        
        passed_count = 0
        failed_count = 0
        skipped_count = 0
        
        for name, status in self.results.items():
            dots = "." * (35 - len(name))
            reason_str = f" ({self.reasons[name]})" if status in ("FAIL", "SKIP") else ""
            print(f"{name} {dots} {status}{reason_str}")
            if status == "PASS":
                passed_count += 1
            elif status == "FAIL":
                failed_count += 1
            elif status == "SKIP":
                skipped_count += 1

        print("=" * 60)
        print("TOTAL")
        print(f"Passed : {passed_count}")
        print(f"Failed : {failed_count}")
        print(f"Skipped: {skipped_count}")
        print(f"Execution Time: {duration:.2f} seconds")
        print("=" * 60)
        print("Sprint B1 Authentication Module Validation Complete\n")
        
        if failed_count > 0 or len(self.missing_dependencies) > 0:
            sys.exit(1)
        else:
            sys.exit(0)


def run_system_validation():
    tester = ValidationTester()
    tester.start()

    # ---------------------------------------------------------
    # 1. Environment Validation
    # ---------------------------------------------------------
    try:
        assert SECRET_KEY is not None and len(SECRET_KEY) >= 32, "SECRET_KEY must be configured and at least 32 characters"
        assert ALGORITHM == "HS256", f"Algorithm configured as {ALGORITHM}, expected HS256"
        assert ACCESS_TOKEN_EXPIRE_MINUTES == 30, f"ACCESS_TOKEN_EXPIRE_MINUTES is {ACCESS_TOKEN_EXPIRE_MINUTES}, expected 30"
        tester.log_result("Environment Validation", True)
    except Exception as e:
        tester.log_result("Environment Validation", False, str(e))
        tester.finish()

    # ---------------------------------------------------------
    # 2. Database & Model Validation (Required User Contract)
    # ---------------------------------------------------------
    db_connected = False
    try:
        # Check database connection and basic query capability
        with get_session() as session:
            session.execute(text("SELECT 1"))
            db_connected = True
            
        # Inspect SQLAlchemy User model columns
        from sqlalchemy import inspect
        mapper = inspect(User)
        columns = [c.key for c in mapper.attrs]
        
        required_fields = ["user_id", "username", "password_hash", "role", "district_id", "station_id", "is_active"]
        missing = []
        
        # Check standard properties
        if "user_id" not in columns:
            missing.append("user_id (or equivalent ID)")
        if "username" not in columns:
            missing.append("username")
        if "password_hash" not in columns:
            missing.append("password_hash")
        if "role" not in columns and "role_id" not in columns:
            missing.append("role/role_id")
        if "district_id" not in columns:
            missing.append("district_id")
        if "station_id" not in columns:
            missing.append("station_id")
        if "is_active" not in columns:
            missing.append("is_active")
            
        if len(missing) > 0:
            tester.missing_dependencies = missing
            tester.log_result("Database Connection", True)
            tester.log_result(
                "Repository Contract", 
                False, 
                f"SQLAlchemy User model fails contract. Missing attributes: {', '.join(missing)}"
            )
        else:
            tester.log_result("Database Connection", True)
            tester.log_result("Repository Contract", True)
    except Exception as e:
        tester.log_result("Database Connection", False, f"Failed to connect to database: {str(e)}")
        tester.log_result("Repository Contract", False, "Skipped due to connection failure")
        tester.finish()

    # ---------------------------------------------------------
    # 3. Password Module Validation
    # ---------------------------------------------------------
    try:
        # Valid verification
        p1 = "Vigilens123!"
        h1 = hash_password(p1)
        assert verify_password(p1, h1) is True, "Password verification failed"
        assert verify_password("WrongPass", h1) is False, "Mismatched password passed validation"
        
        # Identical passwords should generate different hashes (due to salt)
        h2 = hash_password(p1)
        assert h1 != h2, "Argon2id salts are not changing across hashes"
        
        # Extreme inputs
        assert verify_password("", hash_password("")) is True, "Empty password validation failed"
        unicode_pass = "🛡️哨兵AI🛡️"
        assert verify_password(unicode_pass, hash_password(unicode_pass)) is True, "Unicode password validation failed"
        
        sql_inj_pass = "' OR '1'='1"
        assert verify_password(sql_inj_pass, hash_password(sql_inj_pass)) is True, "SQL injection password check failed"
        
        long_pass = "a" * 1000
        assert verify_password(long_pass, hash_password(long_pass)) is True, "Extremely long password validation failed"
        
        tester.log_result("Password Module", True)
    except Exception as e:
        tester.log_result("Password Module", False, str(e))

    # ---------------------------------------------------------
    # 4. JWT Module Validation
    # ---------------------------------------------------------
    try:
        # Standard UUID string sub
        payload = TokenPayload(
            sub="user-uuid-1234567890",
            role_id=Roles.INVESTIGATING_OFFICER,
            district_id="district-uuid-1",
            station_id="station-uuid-101"
        )
        token = create_access_token(payload)
        decoded = verify_access_token(token)
        assert decoded.sub == "user-uuid-1234567890", "Subject claim mismatch"
        assert decoded.role_id == Roles.INVESTIGATING_OFFICER, "Role claim mismatch"
        assert decoded.district_id == "district-uuid-1", "District claim mismatch"
        assert decoded.station_id == "station-uuid-101", "Station claim mismatch"
        
        # Invalid signature
        with pytest_raises(InvalidTokenError):
            verify_access_token(token + "corrupted")
            
        # Expired token
        past_time = int((datetime.now(timezone.utc) - timedelta(minutes=5)).timestamp())
        expired_payload = TokenPayload(
            sub="user-uuid-12345",
            role_id=Roles.INVESTIGATING_OFFICER,
            exp=past_time
        )
        expired_token = create_access_token(expired_payload)
        with pytest_raises(ExpiredTokenError):
            verify_access_token(expired_token)
            
        # Wrong algorithm signature check
        header = {"alg": "none", "typ": "JWT"}
        malformed_token = jwt.encode(payload.model_dump(), "wrong_key", algorithm="HS256")
        # Try to decode with a different algorithm key or none
        with pytest_raises(InvalidTokenError):
            verify_access_token(malformed_token)
            
        tester.log_result("JWT Module", True)
    except Exception as e:
        tester.log_result("JWT Module", False, str(e))

    # ---------------------------------------------------------
    # 5. Repository Validation
    # ---------------------------------------------------------
    # If the User model contract is broken, we cannot query or perform repository tests
    if len(tester.missing_dependencies) > 0:
        tester.log_result("Repository Validation", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("Login Flow", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("Dependencies", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("Geographic Permissions", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("Security Validation", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("API Contract", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("Performance", False, "Skipped: Missing User model contracts", skipped=True)
        tester.log_result("Regression", False, "Skipped: Missing User model contracts", skipped=True)
    else:
        # Perform validation of repository lookup logic against SQLite fallback schema
        try:
            with get_session() as session:
                user_repo = UserRepository(session)
                # Lookup non-existent
                missing_user = user_repo.get_by_username("non_existent_officer_abc")
                assert missing_user is None, "Repository did not return None for unknown username"
                
                # Verify repository contract is the only point utilized
                tester.log_result("Repository Validation", True)
        except Exception as e:
            tester.log_result("Repository Validation", False, str(e))

        # ---------------------------------------------------------
        # 6. Login Flow Validation
        # ---------------------------------------------------------
        try:
            # We seed a temporary sqlite user for login validation
            with get_session() as session:
                # Setup models
                dist = District(district_id="dist-99", district_name="Bengaluru", district_code="BLR")
                role = Role(role_id="role-sho", role_name="Inspector")
                user = User(
                    user_id="user-cubbon-1",
                    username="sho_cubbon",
                    email="sho@cubbon.gov",
                    password_hash=hash_password("Vigilens123!"),
                    role=role,
                    district=dist,
                    station_id="station-123",
                    is_active=True
                )
                session.add_all([dist, role, user])
                session.commit()
                
                # Test successful login logic through the UserRepository
                user_repo = UserRepository(session)
                db_user = user_repo.get_by_username("sho_cubbon")
                assert db_user is not None
                assert verify_password("Vigilens123!", db_user.password_hash) is True
                assert db_user.is_active is True
                
                # Test invalid password rejection
                assert verify_password("WrongPassword", db_user.password_hash) is False
                
                # Clean up test user
                session.delete(user)
                session.delete(role)
                session.delete(dist)
                session.commit()
                
            tester.log_result("Login Flow", True)
        except Exception as e:
            tester.log_result("Login Flow", False, str(e))

        # ---------------------------------------------------------
        # 7. Dependencies (FastAPI Context Mocking)
        # ---------------------------------------------------------
        try:
            # Test mapping db_user to CurrentUser
            db_user_mock = User(
                user_id="mock-user-123",
                username="officer_mock",
                email="mock@officer.gov",
                district_id="dist-99",
                station_id="station-123",
                is_active=True
            )
            # Create a mock Role mapping
            db_user_mock.role = Role(role_name="Inspector")
            
            curr_user = map_db_user_to_current_user(db_user_mock)
            assert curr_user.id == "mock-user-123", "CurrentUser ID mapping mismatch"
            assert curr_user.role == Roles.STATION_HOUSE_OFFICER, "CurrentUser Role mapping mismatch"
            assert curr_user.district_id == "dist-99", "CurrentUser District mapping mismatch"
            assert curr_user.station_id == "station-123", "CurrentUser Station mapping mismatch"
            assert curr_user.is_active is True
            
            tester.log_result("Dependencies", True)
        except Exception as e:
            tester.log_result("Dependencies", False, str(e))

        # ---------------------------------------------------------
        # 8. RBAC Validation
        # ---------------------------------------------------------
        try:
            # System Admin permissions
            sys_admin = CurrentUser(id="sys-1", role=Roles.SYSTEM_ADMIN, is_active=True)
            assert has_permission(sys_admin, Permission.DELETE_CASE) is True
            assert has_permission(sys_admin, Permission.MANAGE_USERS) is True
            assert has_permission(sys_admin, Permission.VIEW_ANALYTICS) is True
            
            # SHO permissions
            sho = CurrentUser(id="sho-1", role=Roles.STATION_HOUSE_OFFICER, is_active=True)
            assert has_permission(sho, Permission.DELETE_CASE) is False
            assert has_permission(sho, Permission.UPDATE_CASE) is True
            assert has_permission(sho, Permission.MANAGE_USERS) is False
            
            # Investigating Officer permissions
            io = CurrentUser(id="io-1", role=Roles.INVESTIGATING_OFFICER, is_active=True)
            assert has_permission(io, Permission.UPDATE_CASE) is False
            assert has_permission(io, Permission.CREATE_CASE) is True
            
            tester.log_result("RBAC", True)
        except Exception as e:
            tester.log_result("RBAC", False, str(e))

        # ---------------------------------------------------------
        # 9. Geographic Permissions Validation
        # ---------------------------------------------------------
        try:
            district_user = CurrentUser(
                id="ds-1",
                role=Roles.DISTRICT_SUPERINTENDENT,
                district_id="dist-mysuru",
                station_id=None,
                is_active=True
            )
            
            # District superintendent checks (no identifier casting)
            assert can_access_district(district_user, "dist-mysuru") is True
            assert can_access_district(district_user, "dist-bengaluru") is False
            
            # System admin check (unrestricted access)
            sys_admin = CurrentUser(id="sys-1", role=Roles.SYSTEM_ADMIN, district_id=None, is_active=True)
            assert can_access_district(sys_admin, "dist-mysuru") is True
            assert can_access_district(sys_admin, "dist-any") is True
            
            tester.log_result("Geographic Permissions", True)
        except Exception as e:
            tester.log_result("Geographic Permissions", False, str(e))

        # ---------------------------------------------------------
        # 10. Security Validation
        # ---------------------------------------------------------
        try:
            # Verify password_hash is not present in CurrentUser schema
            assert "password_hash" not in CurrentUser.model_fields, "password_hash leaked in CurrentUser Pydantic fields"
            assert "password" not in CurrentUser.model_fields, "password leaked in CurrentUser Pydantic fields"
            
            # Verify JWT contains only non-PII claims (sub, role_id, district_id, station_id, exp)
            payload = TokenPayload(sub="user-uuid-1", role_id=Roles.INVESTIGATING_OFFICER)
            token = create_access_token(payload)
            unverified_claims = jwt.decode(token, options={"verify_signature": False})
            
            allowed_claims = {"sub", "role_id", "district_id", "station_id", "exp"}
            for claim in unverified_claims:
                assert claim in allowed_claims, f"Unsecured PII claim '{claim}' found in JWT payload"
                
            tester.log_result("Security", True)
        except Exception as e:
            tester.log_result("Security", False, str(e))

        # ---------------------------------------------------------
        # 11. API Contract Validation
        # ---------------------------------------------------------
        try:
            # LoginRequest schema checking
            req = LoginRequest(username="officer123", password="Password!")
            assert req.username == "officer123"
            assert req.password == "Password!"
            
            # LoginResponse / TokenResponse schema checking
            token_resp = TokenResponse(access_token="token_xyz", token_type="Bearer", expires_in=1800)
            curr_user = CurrentUser(id="user-123", role=Roles.SYSTEM_ADMIN, is_active=True)
            login_resp = LoginResponse(user=curr_user, token=token_resp)
            
            assert login_resp.token.access_token == "token_xyz"
            assert login_resp.user.id == "user-123"
            
            tester.log_result("API Contract", True)
        except Exception as e:
            tester.log_result("API Contract", False, str(e))

        # ---------------------------------------------------------
        # 12. Performance Smoke Tests
        # ---------------------------------------------------------
        try:
            # Run 50 iterations of operations to verify stability
            p = "Vigilens123!"
            h = hash_password(p)
            for _ in range(50):
                hash_password(p)
                verify_password(p, h)
                
            payload = TokenPayload(sub="u-1", role_id=Roles.INVESTIGATING_OFFICER)
            for _ in range(50):
                t = create_access_token(payload)
                verify_access_token(t)
                
            tester.log_result("Performance", True)
        except Exception as e:
            tester.log_result("Performance", False, str(e))

        # ---------------------------------------------------------
        # 13. Regression Validation
        # ---------------------------------------------------------
        try:
            # Verify previously working password hashing/verification continues to work
            p = "Vigilens123!"
            h = hash_password(p)
            assert verify_password(p, h) is True
            
            # Verify JWT decoding
            payload = TokenPayload(sub="u-99", role_id=Roles.INVESTIGATING_OFFICER)
            t = create_access_token(payload)
            assert verify_access_token(t).sub == "u-99"
            
            tester.log_result("Regression", True)
        except Exception as e:
            tester.log_result("Regression", False, str(e))

    # Compile validation results
    tester.finish()


def pytest_raises(expected_exception):
    """Simple wrapper context manager acting like pytest.raises."""
    class ContextManager:
        def __enter__(self):
            return self
            
        def __exit__(self, exc_type, exc_val, exc_tb):
            if exc_type is None:
                raise AssertionError(f"Expected exception {expected_exception.__name__} was not raised")
            if issubclass(exc_type, expected_exception):
                return True
            return False
    return ContextManager()


if __name__ == "__main__":
    from sqlalchemy import text
    run_system_validation()
