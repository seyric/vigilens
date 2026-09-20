# Database Integration & Repositories Guide

Welcome to the Vigilens backend database guide. This document is written for database developers maintaining PostgreSQL, PostGIS, Neo4j, SQLAlchemy models, and repository interfaces. It defines the core integration contracts, ORM expectations, and data querying rules.

---

## 🏗️ 1. Backend Database Expectations

To preserve modularity and protect the REST layer from schema modifications:

1. **No Raw SQL inside Routers or Services**:
   - The backend service layer _never_ compiles or executes raw SQL strings. All queries must flow through SQLAlchemy ORM classes, repositories, or helper services.
2. **Repositories Own Data Access**:
   - Database operations (inserts, updates, lookups) must be encapsulated inside classes defined in `database/repositories.py` inheriting from `BaseRepository`.
3. **Compatibility Mode**:

- A runtime fallback manager is active in [connection.py](../database/connection.py). If PostgreSQL is unavailable, database sessions fallback to SQLite. Write all models and repositories to be dialect-agnostic.

---

## 👥 2. Required User Model Contract (B1 Authentication)

The REST authentication router ([backend/auth/router.py](auth/router.py)) and dependencies ([backend/auth/dependencies.py](auth/dependencies.py)) depend on a specific attribute contract on the SQLAlchemy `User` ORM class.

> [!IMPORTANT]
> The database migration schema must ensure the `users` table exposes the columns listed below.
> **DO NOT modify the backend core code** to alter these attribute names, as the security layers depend on them as a strict integration contract:

| Model Property  | Data Type    | Database Constraint      | Purpose                                                         |
| :-------------- | :----------- | :----------------------- | :-------------------------------------------------------------- |
| `user_id`       | String(36)   | Primary Key (UUID)       | Unique user identifier. Maps to the token's `sub` claim.        |
| `username`      | String(50)   | Unique, Not Null         | Unique username for credentials verification.                   |
| `password_hash` | String(255)  | Nullable                 | Stores the Argon2id password hash.                              |
| `role`          | Relationship | Joined to `Role` model   | Resolves user permission profiles.                              |
| `district_id`   | String(36)   | Nullable ForeignKey      | Restricts access scope to a specific district.                  |
| `station_id`    | String(36)   | Nullable ForeignKey      | Restricts access scope to a specific station.                   |
| `is_active`     | Boolean      | Not Null, Default `True` | Active status checker. Disabled users are rejected immediately. |

---

## 🛠️ 3. Repository & Query Service Contracts

Your database repositories must implement and maintain the following method contracts. If these signatures change, the REST services will break:

---

### Class: `UserRepository`

Encapsulates user account operations.

- `get_by_username(username: str) -> Optional[User]`
  - **Parameters**: `username` (string)
  - **Return type**: `User` model instance or `None`
  - **Exceptions**: `SQLAlchemyError` on database failure.
- `get(entity_type: Type[User], entity_id: str) -> Optional[User]`
  - **Parameters**: `entity_type` (User model class), `entity_id` (string UUID)
  - **Return type**: `User` instance or `None`.

---

### Class: `FIRRepository`

Manages First Information Reports (cases).

- `get_by_number(fir_number: str) -> Optional[FIR]`
  - **Parameters**: `fir_number` (string)
  - **Return type**: `FIR` model instance or `None`
- `list_by_district(district_id: str) -> List[FIR]`
  - **Parameters**: `district_id` (string UUID)
  - **Return type**: List of `FIR` objects.

---

### Class: `CrimeRepository`

Tracks specific offense events.

- `get_by_fir(fir_id: str) -> List[Crime]`
  - **Parameters**: `fir_id` (string UUID)
  - **Return type**: List of `Crime` objects.
- `get_by_category(category_id: str) -> List[Crime]`
  - **Parameters**: `category_id` (string UUID)
  - **Return type**: List of `Crime` objects.
- `get_recent(limit: int = 50) -> List[Crime]`
  - **Parameters**: `limit` (integer)
  - **Return type**: List of the most recent `Crime` objects, sorted descending by reporting date.

---

### Class: `OfficerRepository`

Tracks law enforcement officer directory details.

- `get_by_badge_number(badge_number: str) -> Optional[Officer]`
  - **Parameters**: `badge_number` (string)
  - **Return type**: `Officer` model instance or `None`
- `list_by_district(district_id: str) -> List[Officer]`
  - **Parameters**: `district_id` (string UUID)

---

### Class: `DistrictRepository`

- `get_by_name(name: str) -> Optional[District]`
  - **Parameters**: `name` (string)
- `get_by_code(code: str) -> Optional[District]`
  - **Parameters**: `code` (string)

---

### Class: `EvidenceRepository`

Tracks physical and digital evidence items.

- `get_by_type(evidence_type: str) -> List[Evidence]`
  - **Parameters**: `evidence_type` (string)
- `get_by_collector(officer_id: str) -> List[Evidence]`
  - **Parameters**: `officer_id` (string UUID)

---

### Class: `AnalyticsRepository`

Computes metrics aggregates.

- `crimes_by_district() -> List[Tuple[str, int]]`
  - **Returns**: List of `(district_name, crime_count)` tuples.
- `crimes_by_category() -> List[Tuple[str, int]]`
  - **Returns**: List of `(category_name, crime_count)` tuples.
- `monthly_crime_counts() -> List[Dict[str, Any]]`
  - **Returns**: List of monthly summaries: `[{"month": "YYYY-MM-01", "crime_count": int}]`.

---

### Class: `QueryService`

Provides highly optimized queries combining model joins for REST dashboard components.

- `crimes_by_district() -> List[Dict[str, Any]]`
- `crimes_by_category() -> List[Dict[str, Any]]`
- `monthly_crime_statistics() -> List[Dict[str, Any]]`
- `officer_workload() -> List[Dict[str, Any]]`
- `fir_search(search_text: str) -> List[Dict[str, Any]]`
  - **Parameters**: `search_text` (string)
  - **Returns**: Up to 50 matching cases containing the keyword in details, number, or complainant name.
- `district_summary() -> List[Dict[str, Any]]`
- `district_heatmap_data() -> List[Dict[str, Any]]`
- `export_relationship_rows() -> List[Dict[str, Any]]`
- `ai_feature_inputs() -> List[Dict[str, Any]]`
- `officer_assignment_map() -> List[Dict[str, Any]]`

---

## 🔒 4. Geographic Scoping Logic

Routers pass the `CurrentUser` security context directly to your repositories or services. When writing queries, verify you check their scope constraints:

- **System / State Admin**: No queries are filtered.
- **District Superintendent**: All queries for FIR, Crime, Officer, and Evidence records must filter on the respective `district_id` column.
- **Station / Investigating Officer**: All queries for FIR, Crime, Officer, and Evidence records must filter on the respective `station_id` column.

---

## 🗺️ 5. GIS Heatmap & Neo4j Graph Configurations

### GIS Data (PostGIS & GeoJSON)

- **Requirement**: `District.boundary_geojson` stores geographical boundary coordinates.
- **PostGIS Output**: The database must store this as text representing GeoJSON geometries.
- **Endpoint Consumer**: `GET /analytics/gis/heatmap` pulls this column directly to serve mapping assets to the frontend.

### Neo4j Graph DB Integration

- **Relational Map**: Relational offender associations are imported into Neo4j.
- **Suspect Node Definition**:
  - `(:Suspect {suspect_id, full_name, status})`
- **Suspect Relationships**:
  - `[:ASSOCIATED_WITH {relationship_type, notes}] -> (:Suspect)`
- **Expected Graph Response**: The frontend expects relationship networks to map as:
  `{"nodes": [{"id", "label", "status"}], "edges": [{"source", "target", "relationship"}]}`

---

## 🔮 6. Future Database Optimization Placeholders

The platform's database architecture contains placeholders for the following enhancements:

### 1. Cached Analytics

- **Goal**: Cache dashboard statistics (e.g. daily/hourly caseload figures) using Redis key-value stores.
- _[TBD - DB Team to integrate Redis session caching]_

### 2. Materialized Views

- **Goal**: Accelerate heavy analytics joins over millions of rows by caching GIS heatmap summaries in materialized views.
- _[TBD - DB Team to write PostgreSQL refresh-triggers]_

### 3. Search Optimization

- **Goal**: Migrate the `fir_search` wildcard checks to PostgreSQL Full-Text Search (using GIN indexes on `tsvector` columns) or Elasticsearch.
- _[TBD - DB Team to add GIN indices]_

### 4. Performance Tuning

- **Goal**: Conduct index audits on high-frequency foreign keys (`district_id`, `station_id`, `fir_id`) and optimize database connections pooling parameters.
- _[TBD - DB Team to log EXPLAIN ANALYZE traces]_
