"""
id_generator.py

Generates unique IDs for all Vigilens entities.
"""

from __future__ import annotations

import random
import string
from typing import Set


class IDGenerator:
    """
    Generates unique random IDs for different entities.

    Example:
        PER_KA_26_A8X2LM9Q
        SUS_KA_26_H3K7PW2M
        CAS_KA_26_Z8Q1ND5R
    """

    def __init__(self, state_code: str = "KA", dataset_version: str = "26"):
        self.state_code = state_code
        self.dataset_version = dataset_version
        self.generated_ids: Set[str] = set()

    def _random_token(self, length: int = 8) -> str:
        """Generate a random alphanumeric token."""
        characters = string.ascii_uppercase + string.digits
        return "".join(random.choices(characters, k=length))

    def generate(self, prefix: str) -> str:
        """
        Generate a unique ID.

        Args:
            prefix: Entity prefix
                    PER = Person
                    SUS = Suspect
                    OFF = Officer
                    CAS = Case
                    VIC = Victim
                    WIT = Witness

        Returns:
            Unique ID string.
        """
        while True:
            unique_id = (
                f"{prefix.upper()}_"
                f"{self.state_code}_"
                f"{self.dataset_version}_"
                f"{self._random_token()}"
            )

            if unique_id not in self.generated_ids:
                self.generated_ids.add(unique_id)
                return unique_id


# Singleton instance used across the project
id_generator = IDGenerator()


if __name__ == "__main__":
    print(id_generator.generate("PER"))
    print(id_generator.generate("PER"))
    print(id_generator.generate("SUS"))
    print(id_generator.generate("OFF"))
    print(id_generator.generate("CAS"))