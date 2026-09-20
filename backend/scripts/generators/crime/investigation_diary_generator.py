from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class InvestigationDiaryGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = (
            "Investigation Diary Generator"
        )

        self.output_file = (
            self.generated_dir /
            "investigation_diary.csv"
        )
def load_dependencies(self):

    self.firs = self.dataset_loader.get_generated(
        "firs"
    )

    self.evidence = self.dataset_loader.get_generated(
        "evidence"
    )

    self.arrests = self.dataset_loader.get_generated(
        "arrests"
    )

    self.chargesheets = self.dataset_loader.get_generated(
        "chargesheets"
    )

    self.court_cases = self.dataset_loader.get_generated(
        "court_cases"
    )

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    for fir in self.firs:

        diary_entries = self._generate_diary(
            fir
        )

        self.records.extend(
            diary_entries
        )
def _generate_diary(
    self,
    fir
):

    diary_entries = []

    current_time = fir[
        "registration_datetime"
    ]

    officer = self.fake.name()

    diary_entries.append(

        self._create_entry(

            fir,

            current_time,

            "FIR Registered",

            officer,

            "FIR registered and investigation initiated."

        )

    )

    current_time += timedelta(
        hours=2
    )

    diary_entries.append(

        self._create_entry(

            fir,

            current_time,

            "Crime Scene Inspection",

            officer,

            "Crime scene inspected and secured."

        )

    )

    current_time += timedelta(
        hours=4
    )

    diary_entries.append(

        self._create_entry(

            fir,

            current_time,

            "Witness Examination",

            officer,

            "Statements of witnesses recorded."

        )

    )

    evidence = [

        e

        for e in self.evidence

        if e["fir_id"] == fir["fir_id"]

    ]

    if evidence:

        current_time += timedelta(
            hours=3
        )

        diary_entries.append(

            self._create_entry(

                fir,

                current_time,

                "Evidence Collection",

                officer,

                f"{len(evidence)} evidence item(s) collected."

            )

        )

    arrest = next(

        (

            a

            for a in self.arrests

            if a["fir_id"] == fir["fir_id"]

        ),

        None

    )

    if arrest:

        diary_entries.append(

            self._create_entry(

                fir,

                arrest["arrest_datetime"],

                "Arrest",

                officer,

                "Primary suspect arrested."

            )

        )

    chargesheet = next(

        (

            c

            for c in self.chargesheets

            if c["fir_id"] == fir["fir_id"]

        ),

        None

    )

    if chargesheet:

        diary_entries.append(

            self._create_entry(

                fir,

                chargesheet["filing_date"],

                "Chargesheet Filed",

                officer,

                "Chargesheet submitted before court."

            )

        )

    court_case = next(

        (

            c

            for c in self.court_cases

            if c["fir_id"] == fir["fir_id"]

        ),

        None

    )

    if court_case:

        diary_entries.append(

            self._create_entry(

                fir,

                court_case["hearing_date"],

                "Court Proceedings",

                officer,

                "Court proceedings commenced."

            )

        )

    diary_entries.sort(

        key=lambda x: x[
            "entry_datetime"
        ]

    )

    return diary_entries
def _create_entry(

    self,

    fir,

    entry_time,

    entry_type,

    officer,

    description

):

    return {

        "diary_id":
            IDGenerator.generate(
                "DIA"
            ),

        "case_id":
            fir["case_id"],

        "fir_id":
            fir["fir_id"],

        "entry_datetime":
            entry_time,

        "entry_type":
            entry_type,

        "officer_name":
            officer,

        "description":
            description,

        "status":
            "Recorded"

    }
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "diary_id",
            "case_id",
            "fir_id",
            "entry_datetime",
            "entry_type",
            "officer_name",
            "description",
            "status"
        ]
    )

    Validators.validate_unique(
        self.records,
        "diary_id"
    )

    fir_ids = {
        fir["fir_id"]
        for fir in self.firs
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    fir_lookup = {
        fir["fir_id"]: fir
        for fir in self.firs
    }

    valid_entry_types = {

        "FIR Registered",

        "Crime Scene Inspection",

        "Witness Examination",

        "Evidence Collection",

        "Arrest",

        "Chargesheet Filed",

        "Court Proceedings"

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

        fir = fir_lookup[
            record["fir_id"]
        ]

        if (
            record["entry_datetime"]
            < fir["registration_datetime"]
        ):

            raise ValueError(
                f"Diary entry "
                f"{record['diary_id']} "
                "occurs before FIR registration."
            )

        if (
            record["entry_type"]
            not in valid_entry_types
        ):

            raise ValueError(
                f"Invalid entry type: "
                f"{record['entry_type']}"
            )

        if record["status"] != "Recorded":

            raise ValueError(
                f"Invalid status in "
                f"{record['diary_id']}"
            )

    diary_by_case = {}

    for record in self.records:

        diary_by_case.setdefault(
            record["case_id"],
            []
        ).append(record)

    for entries in diary_by_case.values():

        entries.sort(
            key=lambda x: x["entry_datetime"]
        )

        for i in range(
            1,
            len(entries)
        ):

            if (
                entries[i]["entry_datetime"]
                < entries[i - 1]["entry_datetime"]
            ):

                raise ValueError(
                    "Investigation diary "
                    "timeline is not chronological."
                )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = InvestigationDiaryGenerator()

    generator.run()
