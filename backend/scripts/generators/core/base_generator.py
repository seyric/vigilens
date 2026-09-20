"""
Vigilens
Base Generator

Abstract base class for all dataset generators.

Every generator should inherit from BaseGenerator and implement:

    • load_dependencies()
    • generate()
    • validate()

Pipeline

    Load Dependencies
            ↓
      Generate Records
            ↓
      Validate Records
            ↓
         Save CSV

Provides

✓ Rule Loader
✓ Lookup Loader
✓ ID Generator
✓ CSV Writer
✓ Logging
✓ Random Helper Methods
✓ Output Management
"""

from __future__ import annotations

import logging
import random
from abc import ABC, abstractmethod
from pathlib import Path

from scripts.utils.csv_writer import csv_writer
from scripts.utils.id_generator import id_generator
from scripts.utils.lookup_loader import lookup_loader
from scripts.utils.rule_loader import rules


class BaseGenerator(ABC):
    """
    Parent class for every generator inside Vigilens.

    Every dataset generator should inherit from this class.
    """

    def __init__(
        self,
        output_file: str,
        output_directory: str = "generated"
    ):

        # Generated records
        self.records = []

        # Shared utilities
        self.rules = rules
        self.lookup = lookup_loader
        self.id_generator = id_generator
        self.csv_writer = csv_writer

        # Dataset location
        self.output_directory = (
            Path(__file__).resolve().parents[3]
            / "datasets"
            / output_directory
        )

        self.output_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        self.output_file = self.output_directory / output_file

        # Logger
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s | %(levelname)s | %(message)s"
        )

    # ======================================================
    # Required Methods
    # ======================================================

    @abstractmethod
    def load_dependencies(self):
        """
        Load required lookup tables.

        Example

        districts
        occupations
        crime types
        officer ranks
        """
        pass

    @abstractmethod
    def generate(self):
        """
        Generate records.

        Populate

        self.records
        """
        pass

    @abstractmethod
    def validate(self):
        """
        Validate generated records.

        Raise an exception if validation fails.
        """
        pass

    # ======================================================
    # Save Dataset
    # ======================================================

    def save(self):

        if not self.records:
            raise ValueError(
                f"{self.__class__.__name__}: No records generated."
        )

    self.output_file.parent.mkdir(
        parents=True,
        exist_ok=True
    )
                

        self.csv_writer.write(
            records=self.records,
            output_path=self.output_file,
            overwrite=True
        )

        logging.info(
            f"Saved {len(self.records)} records → "
            f"{self.output_file.name}"
        )

    # ======================================================
    # Execution Pipeline
    # ======================================================

    def run(self):

        logging.info("=" * 65)
        logging.info(
            f"Starting {self.__class__.__name__}"
        )
        logging.info("=" * 65)

        self.load_dependencies()
        logging.info("Dependencies Loaded")

        self.generate()
        logging.info(
            f"Generated {len(self.records)} records"
        )

        self.validate()
        logging.info("Validation Successful")

        self.save()

        logging.info(
            f"{self.__class__.__name__} Completed Successfully\n"
        )

    # ======================================================
    # Random Helper Methods
    # ======================================================

    @staticmethod
    def choose(items):
        """
        Return one random element.
        """
        return random.choice(items)

    @staticmethod
    def choose_many(items, k):
        """
        Return k unique random elements.
        """
        return random.sample(items, k)

    @staticmethod
    def chance(probability: float):
        """
        Example

        chance(0.35)

        Returns True about 35% of the time.
        """
        return random.random() < probability

    @staticmethod
    def randint(start: int, end: int):
        return random.randint(start, end)

    @staticmethod
    def random_float(start: float, end: float):
        return round(
            random.uniform(start, end),
            2
        )

    @staticmethod
    def shuffle(items):
        random.shuffle(items)
        return items

    @staticmethod
    def weighted_choice(items, weights):
        """
        Example

        weighted_choice(
            ["Male","Female"],
            [0.52,0.48]
        )
        """
        return random.choices(
            items,
            weights=weights,
            k=1
        )[0]