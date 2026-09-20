from __future__ import annotations

from database.repositories import DistrictRepository, OfficerRepository, CrimeRepository, AnalyticsRepository

from tests.test_database.helpers import seed_minimum_crime_graph


def test_repository_lookup_methods(session) -> None:
    payload = seed_minimum_crime_graph(session)

    district_repo = DistrictRepository(session)
    officer_repo = OfficerRepository(session)
    crime_repo = CrimeRepository(session)
    analytics_repo = AnalyticsRepository(session)

    assert district_repo.get_by_name("Central").district_code == "CTR"
    assert officer_repo.get_by_badge_number("B-100").full_name == "Asha Kumar"
    assert crime_repo.get_by_fir(payload["fir"].fir_id)[0].crime_description == "Wallet theft"
    assert analytics_repo.count(type(payload["district"])) == 1

