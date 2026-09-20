"""
rule_loader.py

Loads and provides access to generation_rules.json.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict


class RuleLoader:
    """Loads generation rules from config/generation_rules.json."""

    def __init__(self) -> None:
        self._rules: Dict[str, Any] = {}
        self._load_rules()

    def _load_rules(self) -> None:
        """Load the JSON configuration file."""
        config_path = (
            Path(__file__).resolve()
            .parents[2]
            / "config"
            / "generation_rules.json"
        )

        if not config_path.exists():
            raise FileNotFoundError(
                f"Generation rules file not found:\n{config_path}"
            )

        with open(config_path, "r", encoding="utf-8") as file:
            self._rules = json.load(file)

    def get(self, *keys: str, default: Any = None) -> Any:
        """
        Retrieve nested configuration values.

        Example:
            rules.get("person", "count")
            rules.get("case", "count")
            rules.get("suspect", "wanted_probability")
        """
        data = self._rules

        for key in keys:
            if not isinstance(data, dict):
                return default

            data = data.get(key)

            if data is None:
                return default

        return data

    def reload(self) -> None:
        """Reload the configuration from disk."""
        self._load_rules()

    @property
    def rules(self) -> Dict[str, Any]:
        """Return the complete configuration."""
        return self._rules


# Singleton instance
rules = RuleLoader()


if __name__ == "__main__":
    print("Project:", rules.get("project", "name"))
    print("Version:", rules.get("project", "version"))
    print("Persons:", rules.get("person", "count"))
    print("Cases:", rules.get("case", "count"))