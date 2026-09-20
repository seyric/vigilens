"""Live OSINT In-Process Data Store and Background Scheduler.

Manages:
- Fast-tier real-time data (flights, military, satellites) refreshed every 60s
- Slow-tier situational data (news, earthquakes, fires, weather, stocks, oil, infrastructure) refreshed every 300s
- In-memory thread-safe cache with immediate on-demand fallback
"""

from __future__ import annotations

import asyncio
import time
from typing import Any
from loguru import logger

from backend.osint.collectors.sigint import fetch_commercial_flights, fetch_military_flights
from backend.osint.collectors.live_feeds import (
    fetch_earthquakes,
    fetch_firms_fires,
    fetch_space_weather,
    fetch_weather_radar,
    fetch_defense_stocks,
    fetch_oil_prices,
    fetch_satellites,
    fetch_geopolitics_frontlines,
    fetch_live_news,
    get_critical_infrastructure,
    fetch_radio_intercepts,
)

_live_store: dict[str, Any] = {}
_store_timestamps: dict[str, float] = {}

_scheduler_task: asyncio.Task | None = None
_is_active: bool = False
_history_jobs: list[dict] = []


def set_data(key: str, data: Any) -> None:
    _live_store[key] = data
    _store_timestamps[key] = time.time()


def get_data(key: str, default: Any = None) -> Any:
    return _live_store.get(key, default)


def get_timestamp(key: str) -> float:
    return _store_timestamps.get(key, 0.0)


async def refresh_fast_tier() -> dict[str, Any]:
    logger.info("Refreshing OSINT Fast Tier (Flights, Military, Satellites)...")
    flights_task = fetch_commercial_flights()
    mil_task = fetch_military_flights()
    sat_task = fetch_satellites()

    flights, mil, sats = await asyncio.gather(
        flights_task, mil_task, sat_task, return_exceptions=True
    )

    fast_data = {
        "flights": flights if isinstance(flights, list) else [],
        "military": mil if isinstance(mil, list) else [],
        "satellites": sats if isinstance(sats, list) else [],
        "updated_at": int(time.time()),
    }
    set_data("fast", fast_data)
    return fast_data


async def refresh_slow_tier() -> dict[str, Any]:
    logger.info("Refreshing OSINT Slow Tier (Earthquakes, Fires, Weather, Stocks, Oil, News, Frontlines)...")
    tasks = [
        fetch_earthquakes(),
        fetch_firms_fires(),
        fetch_space_weather(),
        fetch_weather_radar(),
        fetch_defense_stocks(),
        fetch_oil_prices(),
        fetch_geopolitics_frontlines(),
        fetch_live_news(),
        fetch_radio_intercepts(),
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    def val(idx: int, default: Any) -> Any:
        r = results[idx]
        return r if not isinstance(r, Exception) and r is not None else default

    slow_data = {
        "earthquakes": val(0, []),
        "fires": val(1, []),
        "space_weather": val(2, {}),
        "radar": val(3, {}),
        "stocks": val(4, {}),
        "oil": val(5, {}),
        "geopolitics": val(6, {}),
        "news": val(7, []),
        "radio": val(8, []),
        "infrastructure": get_critical_infrastructure(),
        "updated_at": int(time.time()),
    }
    set_data("slow", slow_data)
    return slow_data


async def get_fast_tier() -> dict[str, Any]:
    data = get_data("fast")
    # If empty or stale (> 90s), trigger fetch
    if not data or (time.time() - get_timestamp("fast") > 90):
        data = await refresh_fast_tier()
    return data


async def get_slow_tier() -> dict[str, Any]:
    data = get_data("slow")
    # If empty or stale (> 360s), trigger fetch
    if not data or (time.time() - get_timestamp("slow") > 360):
        data = await refresh_slow_tier()
    return data


async def _run_live_feed_scheduler() -> None:
    global _is_active
    _is_active = True
    logger.info("OSINT Live Feed In-Process Scheduler Started.")
    # Initial immediate populating
    try:
        await asyncio.gather(refresh_fast_tier(), refresh_slow_tier(), return_exceptions=True)
    except Exception as exc:
        logger.warning(f"Initial live feed population failed: {exc}")

    fast_interval = 60
    slow_interval = 300
    fast_counter = 0

    while _is_active:
        try:
            await asyncio.sleep(10)
            fast_counter += 10
            if fast_counter % fast_interval == 0:
                await refresh_fast_tier()
            if fast_counter >= slow_interval:
                await refresh_slow_tier()
                fast_counter = 0
        except asyncio.CancelledError:
            break
        except Exception as exc:
            logger.error(f"Live feed scheduler loop error: {exc}")


def start_scheduler() -> None:
    global _scheduler_task, _is_active
    if _scheduler_task is None or _scheduler_task.done():
        _is_active = True
        _scheduler_task = asyncio.create_task(_run_live_feed_scheduler())


def stop_scheduler() -> None:
    global _scheduler_task, _is_active
    _is_active = False
    if _scheduler_task and not _scheduler_task.done():
        _scheduler_task.cancel()
        _scheduler_task = None


def is_running() -> bool:
    return _is_active and _scheduler_task is not None and not _scheduler_task.done()


def record_job(job: dict) -> None:
    _history_jobs.insert(0, job)
    if len(_history_jobs) > 100:
        _history_jobs.pop()


def get_history_jobs() -> list[dict]:
    return _history_jobs
