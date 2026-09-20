# Permissions engine for Role-Based Access Control (RBAC) and authorization checks.
# BASE_PERMISSIONS: direct permissions for each role.
# ROLE_ORDER: hierarchical role list from lowest to highest.
# HIERARCHICAL_PERMISSIONS: dynamically built permission map.
# has_permission: verifies active status and permissions.
# can_access_district: checks district permissions.
# can_access_station: checks station permissions (by integer or object).
# can_manage_users: central MANAGE_USERS check.
# can_view_case: geographic check for viewing a case.
# TODO: Replace StationAccessProtocol and CaseAccessProtocol with database models once SQLAlchemy is integrated.

from typing import Any, Protocol, Optional, Union
from backend.auth.models import Roles, Permission, CurrentUser


class StationAccessProtocol(Protocol):
    id: int
    district_id: Optional[int]


class CaseAccessProtocol(Protocol):
    district_id: Optional[int]
    station_id: Optional[int]


BASE_PERMISSIONS = {
    Roles.INVESTIGATING_OFFICER: {
        Permission.CREATE_CASE,
        Permission.VIEW_ASSIGNED_DISTRICT,
    },
    Roles.STATION_HOUSE_OFFICER: {
        Permission.UPDATE_CASE,
        Permission.EXPORT_REPORT,
    },
    Roles.DISTRICT_SUPERINTENDENT: {
        Permission.VIEW_ANALYTICS,
        Permission.MANAGE_USERS,
    },
    Roles.STATE_ADMIN: {
        Permission.VIEW_ALL_DISTRICTS,
    },
    Roles.SYSTEM_ADMIN: {
        Permission.DELETE_CASE,
    },
}

ROLE_ORDER = [
    Roles.INVESTIGATING_OFFICER,
    Roles.STATION_HOUSE_OFFICER,
    Roles.DISTRICT_SUPERINTENDENT,
    Roles.STATE_ADMIN,
    Roles.SYSTEM_ADMIN
]


def _build_permission_hierarchy() -> dict[Roles, set[Permission]]:
    hierarchy = {}
    accumulated = set()
    for role in ROLE_ORDER:
        accumulated = accumulated.union(BASE_PERMISSIONS.get(role, set()))
        hierarchy[role] = set(accumulated)
    return hierarchy


HIERARCHICAL_PERMISSIONS = _build_permission_hierarchy()


def has_permission(user: CurrentUser, permission: Permission) -> bool:
    if not user.is_active:
        return False
    user_permissions = HIERARCHICAL_PERMISSIONS.get(user.role, set())
    return permission in user_permissions


def can_access_district(user: CurrentUser, district_id: str) -> bool:
    if not user.is_active:
        return False
    if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
        return True
    return user.district_id is not None and user.district_id == district_id


def can_access_station(user: CurrentUser, station_id: Union[str, dict, StationAccessProtocol]) -> bool:
    if not user.is_active:
        return False
    if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
        return True
    
    station_id_val = station_id
    station_district_id = None
    if not isinstance(station_id, str):
        if isinstance(station_id, dict):
            station_id_val = station_id.get("id")
            station_district_id = station_id.get("district_id")
        else:
            station_id_val = getattr(station_id, "id", station_id)
            station_district_id = getattr(station_id, "district_id", None)
            
    if user.role == Roles.DISTRICT_SUPERINTENDENT:
        if station_district_id is not None:
            return user.district_id is not None and user.district_id == station_district_id
        return user.district_id is not None
        
    return user.station_id is not None and user.station_id == station_id_val


def can_manage_users(user: CurrentUser) -> bool:
    return has_permission(user, Permission.MANAGE_USERS)


def can_view_case(user: CurrentUser, case: Union[dict, CaseAccessProtocol]) -> bool:
    if not user.is_active:
        return False
    if user.role in (Roles.SYSTEM_ADMIN, Roles.STATE_ADMIN):
        return True
        
    case_district_id = None
    case_station_id = None
    
    if isinstance(case, dict):
        case_district_id = case.get("district_id")
        case_station_id = case.get("station_id")
    else:
        case_district_id = getattr(case, "district_id", None)
        case_station_id = getattr(case, "station_id", None)
        
    if user.role == Roles.DISTRICT_SUPERINTENDENT:
        return (
            user.district_id is not None 
            and case_district_id is not None 
            and user.district_id == case_district_id
        )
        
    if user.role in (Roles.STATION_HOUSE_OFFICER, Roles.INVESTIGATING_OFFICER):
        return (
            user.station_id is not None 
            and case_station_id is not None 
            and user.station_id == case_station_id
        )
        
    return False
