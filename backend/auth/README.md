# Vigilens Authentication & Authorization Module

This module provides a production-grade, highly decoupled, and strongly typed authentication and authorization (RBAC) system for Vigilens.

---

## Authentication Workflow

```
Officer Login (POST /auth/login)
  │
  ▼
Retrieve user credentials from Database
  │
  ▼
Password Verification (password.py)
  │
  ▼
Generate JWT Access Token (jwt_handler.py) -> Returns TokenResponse
  │
  ▼
Future Requests: Include Bearer JWT in Authorization Header
  │
  ▼
FastAPI Security Dependency Injection (dependencies.py)
  │
  ▼
Verify JWT Signature & Expiration (jwt_handler.py)
  │
  ▼
Instantiate CurrentUser Session Object (models.py / dependencies.py)
  │
  ▼
Verify Permissions & Geographic Scopes (permissions.py)
  │
  ▼
Execute API route and return authorized resource
```

---

## Component Workflows

### 1. Password Hashing
- **Algorithm**: `Argon2id` (the industry standard for secure password hashing).
- **Library**: `pwdlib` wrapping `argon2-cffi`.
- **Flow**:
  - Hashing plain-text passwords before storing them.
  - Verifying plain-text passwords against stored hashes using salt-aware verification.

### 2. JWT Lifecycle
- **Creation**: Signed using HMAC-SHA256 (`HS256`) and the mandatory `SECRET_KEY`. Automatically calculates and injects the `exp` claim based on `ACCESS_TOKEN_EXPIRE_MINUTES`.
- **Payload Schema**: Strict minimum-entropy payload containing:
  - `sub`: Unique integer ID of the user.
  - `role_id`: The integer ID of the user's role.
  - `district_id`: (Optional) District assignment ID.
  - `station_id`: (Optional) Police station assignment ID.
  - `exp`: Token expiration timestamp.
- **Verification**: Signature validation and expiration timestamp check are performed automatically during validation. Throws explicit exceptions on failure.

---

## Role & Permission Hierarchies

### Role Hierarchy
Roles are defined as an `IntEnum` where lower values indicate higher hierarchical authority:
1. `SYSTEM_ADMIN` (1)
2. `STATE_ADMIN` (2)
3. `DISTRICT_SUPERINTENDENT` (3)
4. `STATION_HOUSE_OFFICER` (4)
5. `INVESTIGATING_OFFICER` (5)

Higher roles automatically inherit all permissions from the roles below them in the hierarchy.

### Permission Mapping & Inheritance
- **`INVESTIGATING_OFFICER`**:
  - `CREATE_CASE`: Permission to file/register cases.
  - `VIEW_ASSIGNED_DISTRICT`: Permission to view assignments within their own district.
- **`STATION_HOUSE_OFFICER`** (Inherits `INVESTIGATING_OFFICER`):
  - `UPDATE_CASE`: Permission to update cases.
  - `EXPORT_REPORT`: Permission to export data.
- **`DISTRICT_SUPERINTENDENT`** (Inherits `STATION_HOUSE_OFFICER`):
  - `VIEW_ANALYTICS`: Permission to view analytics dashboards.
  - `MANAGE_USERS`: Permission to manage local user accounts.
- **`STATE_ADMIN`** (Inherits `DISTRICT_SUPERINTENDENT`):
  - `VIEW_ALL_DISTRICTS`: Permission to access data across all districts.
- **`SYSTEM_ADMIN`** (Inherits `STATE_ADMIN`):
  - `DELETE_CASE`: Permission to remove or purge case details.

---

## File Responsibilities

- **`password.py`**: Hashing and verification of passwords only.
- **`jwt_handler.py`**: JWT token signing, expiration generation, and signature verification only.
- **`permissions.py`**: Central engine for role checking, hierarchy resolution, and geographic boundaries checks.
- **`dependencies.py`**: Integration layer for FastAPI dependency injection, extracting tokens, and assembling the session.
- **`models.py`**: Strongly typed data models (Pydantic) and enums (IntEnum, Enum).
- **`exceptions.py`**: Domain-specific authentication and authorization exceptions.
- **`__init__.py`**: Exposing only the stable public API exports of the authentication package.

---

## Public API Exports

Imports should only be performed from `backend.auth` directly. The following functions and models are exported:

### Functions
- `hash_password(password)`: Generates a secure hash.
- `verify_password(password, hashed_password)`: Verifies credentials.
- `create_access_token(payload)`: Signs and creates a JWT.
- `verify_access_token(token)`: Validates and decodes a JWT.
- `has_permission(user, permission)`: Checks user's permissions.
- `get_current_user(...)`: FastAPI dependency to load active user.

### Models & Enums
- `Roles`: IntEnum representing role hierarchy levels.
- `Permission`: Enum representing action-oriented permissions.
- `TokenPayload`: Schema representing the decoded JWT claims.
- `CurrentUser`: Strongly typed session representation of the logged-in user.
- `LoginRequest` / `TokenResponse` / `LoginResponse`: API request/response schemas.

### Exceptions
- `AuthError` (Base exception)
- `InvalidTokenError` / `ExpiredTokenError`
- `InvalidCredentialsError`
- `InactiveUserError`
- `InsufficientPermissionError`

---

## Security Assumptions
1. **Plaintext Passwords**: Passwords must never be logged or stored in plaintext. They are hashed using Argon2id immediately.
2. **PII in JWT**: JWTs must function purely as authorization passports. Personally Identifiable Information (PII) like names, email addresses, phone numbers, or passwords must never be stored inside the payload.
3. **Mandatory Configuration**: The `SECRET_KEY` is strictly required. The application will fail-fast and raise a `RuntimeError` at startup if it is not configured.
4. **Centralized Permissions**: Routing rules must not implement ad-hoc role checking. Permission validation must happen through the centralized engine in `permissions.py`.

---

## Future Roadmap

- **Phase 1**: Password Hashing, JWT Lifecycle, and Role-Based Access Control (RBAC). *(Current)*
- **Phase 2**: SQLAlchemy database integration mapping `CurrentUser` to the database User record.
- **Phase 3**: Refresh token support for longer sessions.
- **Phase 4**: Security auditing and logging of administrative actions.
- **Phase 5**: Real-time session revocation capability.
- **Phase 6**: OAuth / Single Sign-On (SSO) integration options.
