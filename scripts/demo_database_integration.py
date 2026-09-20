"""Demo script for Sprint 4 PostgreSQL database integration."""

from pprint import pprint

from database.connection import get_session, engine, is_using_sqlite
from database.models import Base, District, PoliceStation, Role, User
from database.queries import QueryService
from database.repositories import (
    DistrictRepository,
    FIRRepository,
    PoliceStationRepository,
    RoleRepository,
    UserRepository,
)


def initialize_schema() -> None:
    Base.metadata.create_all(bind=engine)
    print("Database schema initialized.")


def seed_minimal_data(session) -> None:
    district_repo = DistrictRepository(session)
    station_repo = PoliceStationRepository(session)
    role_repo = RoleRepository(session)
    user_repo = UserRepository(session)

    district = district_repo.get_by_name("Central")
    if not district:
        district = district_repo.add(
            District(
                district_name="Central",
                district_code="CTR",
                region="Metro",
                headquarters="Central Headquarters",
            )
        )

    station = station_repo.get_by_code("CTR-001")
    if not station:
        station = station_repo.add(
            PoliceStation(
                station_name="Central Station",
                station_code="CTR-001",
                station_type="Headquarters",
                district=district,
                address="100 Main St",
            )
        )

    role = role_repo.get_by_name("admin")
    if not role:
        role = role_repo.add(
            Role(
                role_name="admin",
                description="System administrator",
                permissions={"etl": True, "analytics": True},
                is_system_role=True,
            )
        )

    user = user_repo.get_by_username("admin")
    if not user:
        user_repo.add(
            User(
                username="admin",
                email="admin@Vigilens-ai.local",
                role=role,
                district=district,
            )
        )


def run_queries(session) -> None:
    query_service = QueryService(session)
    pprint({"using_sqlite": is_using_sqlite()})
    pprint({"district_summary": query_service.district_summary()})
    pprint({"fir_search": query_service.fir_search("test")})


def main() -> None:
    initialize_schema()
    with get_session() as session:
        seed_minimal_data(session)
        run_queries(session)


if __name__ == "__main__":
    main()
