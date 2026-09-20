from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class ArrestGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = "Arrest Generator"

        self.output_file = (
            self.generated_dir /
            "arrests.csv"
        )
def load_dependencies(self):

    self.firs = self.dataset_loader.get_generated(
        "firs"
    )

    self.cases = self.dataset_loader.get_generated(
        "cases"
    )

    self.case_persons = self.dataset_loader.get_generated(
        "case_person_relationships"
    )

    self.persons = self.dataset_loader.get_generated(
        "persons"
    )

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    suspect_relations = [

        relation

        for relation in self.case_persons

        if relation["role"] == "Suspect"

    ]

    fir_lookup = {

        fir["case_id"]: fir

        for fir in self.firs

    }

    for relation in suspect_relations:

        if self.random.random() <= 0.75:

            fir = fir_lookup.get(
                relation["case_id"]
            )

            if fir:

                self.records.append(

                    self._generate_arrest(
                        relation,
                        fir
                    )

                )
def _generate_arrest(
    self,
    relation,
    fir
):

    arrest_time = (
        fir["registration_datetime"]
        + timedelta(
            hours=self.random.randint(
                2,
                168
            )
        )
    )

    return {

        "arrest_id":
            IDGenerator.generate("ARR"),

        "fir_id":
            fir["fir_id"],

        "case_id":
            fir["case_id"],

        "suspect_id":
            relation["person_id"],

        "arrest_datetime":
            arrest_time,

        "arrest_location":
            self._generate_arrest_location(),

        "arresting_officer":
            self.fake.name(),

        "arrest_reason":
            self._generate_arrest_reason(),

        "custody_status":
            self._generate_custody_status(),

        "bail_status":
            self._generate_bail_status()

    }
    def _generate_arrest_location(self):

    return self.fake.address().replace(
        "\n",
        ", "
    )


def _generate_arrest_reason(self):

    reasons = [

        "Named in FIR",

        "Caught during investigation",

        "Identified through CCTV footage",

        "Identified through witness statement",

        "Forensic evidence matched",

        "Confession during interrogation",

        "Recovered stolen property",

        "Linked through digital evidence"

    ]

    return self.random.choice(
        reasons
    )


def _generate_custody_status(self):

    statuses = [

        "Police Custody",

        "Judicial Custody",

        "Released on Bail"

    ]

    return self.random.choice(
        statuses
    )


def _generate_bail_status(self):

    return self.random.choice(

        [

            "Granted",

            "Pending",

            "Rejected",

            "Not Applied"

        ]

    )
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "arrest_id",
            "fir_id",
            "case_id",
            "suspect_id",
            "arrest_datetime",
            "arrest_location",
            "arresting_officer",
            "arrest_reason",
            "custody_status",
            "bail_status"
        ]
    )

    Validators.validate_unique(
        self.records,
        "arrest_id"
    )

    fir_ids = {
        fir["fir_id"]
        for fir in self.firs
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    person_ids = {
        person["person_id"]
        for person in self.persons
    }

    fir_lookup = {
        fir["fir_id"]: fir
        for fir in self.firs
    }

    valid_custody_status = {
        "Police Custody",
        "Judicial Custody",
        "Released on Bail"
    }

    valid_bail_status = {
        "Granted",
        "Pending",
        "Rejected",
        "Not Applied"
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

        if record["suspect_id"] not in person_ids:
            raise ValueError(
                f"Invalid Suspect ID: {record['suspect_id']}"
            )

        fir = fir_lookup[record["fir_id"]]

        if (
            record["arrest_datetime"]
            < fir["registration_datetime"]
        ):
            raise ValueError(
                f"Arrest {record['arrest_id']} "
                "occurred before FIR registration."
            )

        if (
            record["custody_status"]
            not in valid_custody_status
        ):
            raise ValueError(
                f"Invalid custody status: "
                f"{record['custody_status']}"
            )

        if (
            record["bail_status"]
            not in valid_bail_status
        ):
            raise ValueError(
                f"Invalid bail status: "
                f"{record['bail_status']}"
            )

        def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = ArrestGenerator()

    generator.run()