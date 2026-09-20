import os
import sys
from pathlib import Path

# Add the root directory to path to allow imports from database and config
root_dir = Path(__file__).resolve().parents[3]
sys.path.append(str(root_dir))

from database.connection import get_session
from database.models import ActivityLog, User, Role, District, PoliceStation, Officer
from backend.auth.password import hash_password


NEW_USERNAME = "vigilens_operator"
NEW_PASSWORD = "Vigilens#2026!Operator"
LEGACY_USERNAMES = {"sho_asha", "sho-asha", "admin", "vigilens_local"}


def seed_users():
    with get_session() as session:
        # Create default roles
        admin_role = session.query(Role).filter_by(role_name="Admin").first()
        if not admin_role:
            admin_role = Role(role_name="Admin", description="Administrator", permissions={"all": True}, is_system_role=True)
            session.add(admin_role)

        sho_role = session.query(Role).filter_by(role_name="SHO").first()
        if not sho_role:
            sho_role = Role(role_name="SHO", description="Station House Officer", permissions={"read": True, "write": True}, is_system_role=True)
            session.add(sho_role)
            
        session.flush()

        # Get Bengaluru Urban district specifically
        district = session.query(District).filter_by(district_name="Bengaluru Urban").first()
        station = session.query(PoliceStation).filter_by(station_name="Central Station").first()

        # Create a specific officer for sho_asha if needed
        officer = session.query(Officer).filter_by(full_name="Asha Patil").first()
        if not officer:
            officer = Officer(
                full_name="Asha Patil",
                rank="Inspector",
                designation="SHO",
                district_id=district.district_id if district else None,
                station_id=station.station_id if station else None
            )
            session.add(officer)
            session.flush()

        # Ensure System Admin role exists
        sys_admin_role = session.query(Role).filter_by(role_name="System Administrator").first()
        if not sys_admin_role:
            sys_admin_role = Role(role_name="System Administrator", description="Full system access", is_system_role=True)
            session.add(sys_admin_role)
            session.flush()

        # Remove the legacy demo accounts and any dependent activity records.
        legacy_users = session.query(User).filter(User.username.in_(LEGACY_USERNAMES)).all()
        legacy_user_ids = [user.user_id for user in legacy_users]
        if legacy_user_ids:
            session.query(ActivityLog).filter(ActivityLog.user_id.in_(legacy_user_ids)).delete(
                synchronize_session=False
            )
            for user in legacy_users:
                session.delete(user)
            session.flush()

        # Create or rotate the single local development account.
        operator = session.query(User).filter_by(username=NEW_USERNAME).first()
        if not operator:
            operator = User(username=NEW_USERNAME)
            session.add(operator)

        operator.email = "operator@vigilens.local"
        operator.password_hash = hash_password(NEW_PASSWORD)
        operator.role_id = sys_admin_role.role_id
        operator.officer_id = officer.officer_id if officer else None
        operator.district_id = district.district_id if district else None
        operator.station_id = station.station_id if station else None
        operator.is_active = True
            
        session.commit()
        
        print("Successfully seeded users:")
        print(f"- {NEW_USERNAME} / {NEW_PASSWORD} (Rank: Inspector, District: {district.district_name if district else 'Unknown'})")

if __name__ == "__main__":
    seed_users()
