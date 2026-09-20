# Role conversion and mapping logic for Vigilens.

from backend.auth.models import Roles

DATABASE_ROLE_MAP = {
    "Super Admin": Roles.SYSTEM_ADMIN,
    "System Administrator": Roles.SYSTEM_ADMIN,
    "Admin": Roles.STATE_ADMIN,
    "SP": Roles.DISTRICT_SUPERINTENDENT,
    "Inspector": Roles.STATION_HOUSE_OFFICER,
    "SI": Roles.INVESTIGATING_OFFICER,
    "Constable": Roles.INVESTIGATING_OFFICER,
    "Analyst": Roles.INVESTIGATING_OFFICER,
    "Viewer": Roles.INVESTIGATING_OFFICER,
}


def map_db_role_to_auth_role(db_role_name: str) -> Roles:
    """Map a role name string from the database to a Roles enum.

    Args:
        db_role_name: The name of the role in the database.

    Returns:
        The mapped Roles IntEnum.
    """
    if not db_role_name:
        return Roles.INVESTIGATING_OFFICER
    return DATABASE_ROLE_MAP.get(db_role_name, Roles.INVESTIGATING_OFFICER)
