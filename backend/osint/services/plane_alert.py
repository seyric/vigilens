"""Plane-Alert DB -- load and enrich aircraft with tracked metadata."""

from __future__ import annotations

import json
from pathlib import Path
from loguru import logger

_DATA_DIR = Path(__file__).resolve().parents[1] / "data"
_PLANE_ALERT_DB_PATH = _DATA_DIR / "plane_alert_db.json"
_TRACKED_NAMES_PATH = _DATA_DIR / "tracked_names.json"

_CATEGORY_COLOR: dict[str, str] = {
    "USAF": "yellow",
    "Other Air Forces": "yellow",
    "Toy Soldiers": "yellow",
    "Oxcart": "yellow",
    "United States Navy": "yellow",
    "GAF": "yellow",
    "Hired Gun": "yellow",
    "United States Marine Corps": "yellow",
    "Gunship": "yellow",
    "RAF": "yellow",
    "Other Navies": "yellow",
    "Special Forces": "yellow",
    "Zoomies": "yellow",
    "Royal Navy Fleet Air Arm": "yellow",
    "Army Air Corps": "yellow",
    "Aerobatic Teams": "yellow",
    "UAV": "yellow",
    "Ukraine": "yellow",
    "Nuclear": "yellow",
    "Flying Doctors": "#32cd32",
    "Aerial Firefighter": "#32cd32",
    "Coastguard": "#32cd32",
    "Police Forces": "blue",
    "Governments": "blue",
    "Quango": "blue",
    "UK National Police Air Service": "blue",
    "CAP": "blue",
    "PIA": "black",
    "Dictator Alert": "red",
    "Da Comrade": "red",
    "Oligarch": "red",
    "Head of State": "#ff1493",
    "Royal Aircraft": "#ff1493",
    "Bizjets": "#ff1493",
    "Vanity Plate": "#ff1493",
    "Football": "#ff1493",
    "Joe Cool": "orange",
    "Climate Crisis": "white",
    "Historic": "purple",
}


def _category_to_color(cat: str) -> str:
    return _CATEGORY_COLOR.get(cat, "purple")


_POTUS_FLEET: dict[str, dict] = {
    "ADFDF8": {"color": "#ff1493", "operator": "Air Force One (82-8000)", "category": "Head of State", "wiki": "Air_Force_One", "fleet": "AF1"},
    "ADFDF9": {"color": "#ff1493", "operator": "Air Force One (92-9000)", "category": "Head of State", "wiki": "Air_Force_One", "fleet": "AF1"},
    "AE08E2": {"color": "#ff1493", "operator": "Air Force Two (98-0001)", "category": "Head of State", "wiki": "Air_Force_Two", "fleet": "AF2"},
    "AE08E3": {"color": "#ff1493", "operator": "Air Force Two (98-0002)", "category": "Head of State", "wiki": "Air_Force_Two", "fleet": "AF2"},
}

_plane_alert_db: dict[str, dict] | None = None
_tracked_names: dict[str, str] | None = None


def get_plane_alert_db() -> dict[str, dict]:
    global _plane_alert_db
    if _plane_alert_db is not None:
        return _plane_alert_db
    if _PLANE_ALERT_DB_PATH.exists():
        try:
            with open(_PLANE_ALERT_DB_PATH, "r", encoding="utf-8") as f:
                _plane_alert_db = json.load(f)
            return _plane_alert_db
        except Exception as exc:
            logger.warning(f"Error loading plane_alert_db.json: {exc}")
    _plane_alert_db = {}
    return _plane_alert_db


def get_tracked_names() -> dict[str, str]:
    global _tracked_names
    if _tracked_names is not None:
        return _tracked_names
    if _TRACKED_NAMES_PATH.exists():
        try:
            with open(_TRACKED_NAMES_PATH, "r", encoding="utf-8") as f:
                _tracked_names = json.load(f)
            return _tracked_names
        except Exception as exc:
            logger.warning(f"Error loading tracked_names.json: {exc}")
    _tracked_names = {}
    return _tracked_names


def enrich_with_plane_alert(flight: dict) -> dict:
    hex_code = (flight.get("hex") or flight.get("icao24") or "").upper().strip()
    if not hex_code:
        return flight

    if hex_code in _POTUS_FLEET:
        p = _POTUS_FLEET[hex_code]
        flight["operator"] = p["operator"]
        flight["category"] = p["category"]
        flight["tag_color"] = p["color"]
        flight["is_special"] = True
        return flight

    db = get_plane_alert_db()
    entry = db.get(hex_code)
    if entry:
        cat = entry.get("Category", "")
        flight["category"] = cat
        flight["tag_color"] = _category_to_color(cat)
        flight["operator"] = entry.get("Operator", flight.get("operator", ""))
        flight["is_special"] = True
    return flight


def enrich_with_tracked_names(flight: dict) -> dict:
    hex_code = (flight.get("hex") or flight.get("icao24") or "").upper().strip()
    if not hex_code:
        return flight
    names = get_tracked_names()
    name = names.get(hex_code)
    if name:
        flight["tracked_name"] = name
        flight["is_special"] = True
    return flight
