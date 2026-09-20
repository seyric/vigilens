import os
import sys
from pathlib import Path

# Add the root directory to path to allow imports from database and config
root_dir = Path(__file__).resolve().parents[3]
sys.path.append(str(root_dir))

from database.connection import get_session
from database.models import User, Officer, District

def test_db():
    with get_session() as session:
        user = session.query(User).filter_by(username="vigilens_operator").first()
        if user:
            print(f"User: {user.username}, Is Active: {user.is_active}")
            print(f"Password Hash present: {bool(user.password_hash)}")
            if user.officer:
                print(f"Officer Rank: {user.officer.rank}")
                if user.officer.district:
                    print(f"Officer District: {user.officer.district.district_name}")
                else:
                    print("Officer has no district")
            else:
                print("User has no officer")
            if user.district:
                print(f"User District: {user.district.district_name}")
            else:
                print("User has no district")
        else:
            print("User vigilens_operator not found")

if __name__ == "__main__":
    test_db()
