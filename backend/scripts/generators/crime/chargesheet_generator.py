from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class ChargesheetGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = "Chargesheet Generator"

        self.output_file = (
            self.generated_dir /
            "chargesheets.csv"
        )
def load_dependencies(self):

    self.firs = self.dataset_loader.get_generated(
        "firs"
    )

    self.arrests = self.dataset_loader.get_generated(
        "arrests"
    )

    self.cases = self.dataset_loader.get_generated(
        "cases"
    )

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    arrest_lookup = {

        arrest["fir_id"]: arrest

        for arrest in self.arrests

    }

    for fir in self.firs:

        arrest = arrest_lookup.get(
            fir["fir_id"]
        )

        if arrest and self.random.random() <= 0.90:

            self.records.append(

                self._generate_chargesheet(
                    fir,
                    arrest
                )

            )
def _generate_chargesheet_number(self):

    year = self.fake.year()

    number = self.random.randint(
        1000,
        9999
    )

    return f"CS/{year}/{number}"


def _generate_court_name(self):

    courts = [

        "District and Sessions Court",

        "Chief Judicial Magistrate Court",

        "Metropolitan Magistrate Court",

        "Special Cyber Crime Court",

        "Fast Track Court"

    ]

    return self.random.choice(
        courts
    )


def _generate_charges(
    self,
    fir
):

    return fir["legal_sections"]


def _generate_status(self):

    statuses = [

        "Filed",

        "Under Scrutiny",

        "Accepted"

    ]

    return self.random.choice(
        statuses
    )
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "chargesheet_id",
            "chargesheet_number",
            "fir_id",
            "case_id",
            "suspect_id",
            "filing_date",
            "filing_officer",
            "court_name",
            "charges",
            "status"
        ]
    )

    Validators.validate_unique(
        self.records,
        "chargesheet_id"
    )

    Validators.validate_unique(
        self.records,
        "chargesheet_number"
    )

    fir_ids = {
        fir["fir_id"]
        for fir in self.firs
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    arrest_lookup = {
        arrest["fir_id"]: arrest
        for arrest in self.arrests
    }

    valid_status = {

        "Filed",

        "Under Scrutiny",

        "Accepted"

    }

    for record in self.records:

        if record["fir_id"] not in fir_ids:

            raise ValueError(
                f"Invalid FIR ID: {record['fir_id']}"
            )

        if record["case_id"] not in case_ids:

            raise ValueError(
                f"Invalid Case ID: {record['case_id']}"
            )

        arrest = arrest_lookup.get(
            record["fir_id"]
        )

        if arrest is None:

            raise ValueError(
                f"No arrest found for FIR "
                f"{record['fir_id']}"
            )

        if (
            record["suspect_id"]
            != arrest["suspect_id"]
        ):

            raise ValueError(
                f"Suspect mismatch in "
                f"{record['chargesheet_id']}"
            )

        if (
            record["filing_date"]
            < arrest["arrest_datetime"]
        ):

            raise ValueError(
                f"Chargesheet "
                f"{record['chargesheet_id']} "
                "filed before arrest."
            )

        if (
            record["status"]
            not in valid_status
        ):

            raise ValueError(
                f"Invalid status: "
                f"{record['status']}"
            )

        if not record["charges"]:

            raise ValueError(
                f"Charges missing in "
                f"{record['chargesheet_id']}"
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = ChargesheetGenerator()

    generator.run()