from __future__ import annotations

from delivery.sprint5 import Sprint5DataDeliveryLayer

from tests.test_database.helpers import seed_sprint5_delivery_graph


def test_sprint5_delivery_layer_builds_expected_outputs(session) -> None:
    seed_sprint5_delivery_graph(session)
    layer = Sprint5DataDeliveryLayer(session, output_dir="reports/test_sprint5")

    manifest = layer.build()

    assert manifest["dashboard"]["summary"]["total_crimes"] == 2
    assert manifest["dashboard"]["summary"]["active_cases"] == 1
    assert manifest["dashboard"]["summary"]["solved_cases"] == 1
    assert manifest["dashboard"]["summary"]["arrest_rate"] == 50.0

    assert len(manifest["district"]) == 2
    assert manifest["district"][0]["district_name"] == "Central"
    assert "Theft" in manifest["district"][0]["crime_categories"]

    assert manifest["gis"]["crime_coordinates"][0]["location_source"] == "police_station"
    assert manifest["gis"]["geojson_exports"]["district_boundaries"]["type"] == "FeatureCollection"

    labels = {node["label"] for node in manifest["neo4j"]["nodes"]}
    assert {"District", "Crime", "Suspect", "Vehicle", "Weapon", "Evidence"}.issubset(labels)

    assert manifest["ai"]["rag_ready_datasets"][0]["clean_fir_text"].startswith("fir")
    assert manifest["backend"]["dashboard_summary"]["total_crimes"] == 2
    assert manifest["optimization"]["indexes"][0].startswith("CREATE INDEX")


def test_sprint5_delivery_layer_writes_reports(session) -> None:
    seed_sprint5_delivery_graph(session)
    layer = Sprint5DataDeliveryLayer(session, output_dir="reports/test_sprint5_write")

    bundles = layer.write_all()
    bundle_paths = {bundle.path.name for bundle in bundles}

    assert "dashboard_analytics.json" in bundle_paths
    assert "district_analytics.csv" in bundle_paths
    assert "gis_layer.json" in bundle_paths
    assert "neo4j_nodes.csv" in bundle_paths
    assert "sprint5_delivery_report.md" in bundle_paths
