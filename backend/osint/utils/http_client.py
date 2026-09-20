"""Async HTTP client with retry and circuit-breaker logic using httpx."""

from __future__ import annotations

import asyncio
import time
from typing import Any
from urllib.parse import urlparse

import httpx
from loguru import logger

_domain_fail_count: dict[str, int] = {}
_domain_fail_time: dict[str, float] = {}
_CB_THRESHOLD = 5
_CB_COOLDOWN = 60.0
_USER_AGENT = "Vigilens-OSINT/1.0 (multi-int-fusion)"


def _check_circuit(domain: str) -> None:
    fail_t = _domain_fail_time.get(domain, 0.0)
    if _domain_fail_count.get(domain, 0) >= _CB_THRESHOLD:
        if time.monotonic() - fail_t < _CB_COOLDOWN:
            raise RuntimeError(f"Circuit breaker open for {domain}")
        _domain_fail_count.pop(domain, None)
        _domain_fail_time.pop(domain, None)


def _record_failure(domain: str) -> None:
    _domain_fail_count[domain] = _domain_fail_count.get(domain, 0) + 1
    _domain_fail_time[domain] = time.monotonic()


def _record_success(domain: str) -> None:
    _domain_fail_count.pop(domain, None)
    _domain_fail_time.pop(domain, None)


async def fetch_json(
    url: str,
    *,
    method: str = "GET",
    timeout: int = 15,
    headers: dict[str, str] | None = None,
    json_data: Any = None,
    retries: int = 2,
    backoff: float = 0.5,
) -> Any:
    domain = urlparse(url).netloc
    _check_circuit(domain)

    merged_headers = {"User-Agent": _USER_AGENT}
    if headers:
        merged_headers.update(headers)

    last_exc: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            async with httpx.AsyncClient(timeout=float(timeout), follow_redirects=True) as client:
                resp = await client.request(method, url, headers=merged_headers, json=json_data)
                resp.raise_for_status()
                _record_success(domain)
                return resp.json()
        except Exception as exc:
            last_exc = exc
            if attempt < retries:
                await asyncio.sleep(backoff * (2 ** (attempt - 1)))

    _record_failure(domain)
    raise last_exc or RuntimeError(f"Failed to fetch {url}")


async def fetch_text(
    url: str,
    *,
    method: str = "GET",
    timeout: int = 20,
    headers: dict[str, str] | None = None,
    retries: int = 2,
    backoff: float = 0.5,
) -> str:
    domain = urlparse(url).netloc
    _check_circuit(domain)

    merged_headers = {"User-Agent": _USER_AGENT}
    if headers:
        merged_headers.update(headers)

    last_exc: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            async with httpx.AsyncClient(timeout=float(timeout), follow_redirects=True) as client:
                resp = await client.request(method, url, headers=merged_headers)
                resp.raise_for_status()
                _record_success(domain)
                return resp.text
        except Exception as exc:
            last_exc = exc
            if attempt < retries:
                await asyncio.sleep(backoff * (2 ** (attempt - 1)))

    _record_failure(domain)
    raise last_exc or RuntimeError(f"Failed to fetch {url}")
