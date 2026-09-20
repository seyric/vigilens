from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class CourtGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = "Court Generator"

        self.output_file = (
            self.generated_dir /
            "court_cases.csv"
        )
def load_dependencies(self):

    self.chargesheets = self.dataset_loader.get_generated(
        "chargesheets"
    )

    self.firs = self.dataset_loader.get_generated(
        "firs"
    )

    self.cases = self.dataset_loader.get_generated(
        "cases"
    )

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    for chargesheet in self.chargesheets:

        self.records.append(

            self._generate_court_case(
                chargesheet
            )

        )
def _generate_court_case(
    self,
    chargesheet
):

    hearing_date = (
        chargesheet["filing_date"]
        + timedelta(
            days=self.random.randint(
                15,
                45
            )
        )
    )

    case_status = self._generate_case_status()

    return {

        "court_case_id":
            IDGenerator.generate("CRT"),

        "chargesheet_id":
            chargesheet["chargesheet_id"],

        "fir_id":
            chargesheet["fir_id"],

        "case_id":
            chargesheet["case_id"],

        "court_name":
            chargesheet["court_name"],

        "judge_name":
            self._generate_judge_name(),

        "hearing_date":
            hearing_date,

        "next_hearing_date":
            self._generate_next_hearing_date(
                hearing_date,
                case_status
            ),

        "case_status":
            case_status,

        "verdict":
            self._generate_verdict(
                case_status
            )

    }
def _generate_judge_name(self):

    return (
        "Hon'ble Justice "
        + self.fake.name()
    )


def _generate_case_status(self):

    statuses = [

        "Pending",

        "Under Trial",

        "Adjourned",

        "Disposed"

    ]

    return self.random.choice(
        statuses
    )


def _generate_next_hearing_date(
    self,
    hearing_date,
    case_status
):

    if case_status == "Disposed":

        return None

    return (
        hearing_date
        + timedelta(
            days=self.random.randint(
                15,
                60
            )
        )
    )


def _generate_verdict(
    self,
    case_status
):

    if case_status != "Disposed":

        return "Pending"

    return self.random.choice(

        [

            "Convicted",

            "Acquitted",

            "Case Dismissed"

        ]

    )
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "court_case_id",
            "chargesheet_id",
            "fir_id",
            "case_id",
            "court_name",
            "judge_name",
            "hearing_date",
            "next_hearing_date",
            "case_status",
            "verdict"
        ]
    )

    Validators.validate_unique(
        self.records,
        "court_case_id"
    )

    chargesheet_lookup = {
        chargesheet["chargesheet_id"]: chargesheet
        for chargesheet in self.chargesheets
    }

    fir_ids = {
        fir["fir_id"]
        for fir in self.firs
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    valid_status = {

        "Pending",

        "Under Trial",

        "Adjourned",

        "Disposed"

    }

    valid_verdicts = {

        "Pending",

        "Convicted",

        "Acquitted",

        "Case Dismissed"

    }

    for record in self.records:

        if (
            record["chargesheet_id"]
            not in chargesheet_lookup
        ):

            raise ValueError(
                f"Invalid Chargesheet ID: "
                f"{record['chargesheet_id']}"
            )

        if record["fir_id"] not in fir_ids:

            raise ValueError(
                f"Invalid FIR ID: "
                f"{record['fir_id']}"
            )

        if record["case_id"] not in case_ids:

            raise ValueError(
                f"Invalid Case ID: "
                f"{record['case_id']}"
            )

        chargesheet = chargesheet_lookup[
            record["chargesheet_id"]
        ]

        if (
            record["hearing_date"]
            < chargesheet["filing_date"]
        ):

            raise ValueError(
                f"Court case "
                f"{record['court_case_id']} "
                "has an invalid hearing date."
            )

        if (
            record["case_status"]
            not in valid_status
        ):

            raise ValueError(
                f"Invalid case status: "
                f"{record['case_status']}"
            )

        if (
            record["verdict"]
            not in valid_verdicts
        ):

            raise ValueError(
                f"Invalid verdict: "
                f"{record['verdict']}"
            )

        if (
            record["case_status"] == "Disposed"
            and record["next_hearing_date"] is not None
        ):

            raise ValueError(
                "Disposed cases should not "
                "have a next hearing date."
            )

        if (
            record["case_status"] != "Disposed"
            and record["next_hearing_date"] is None
        ):

            raise ValueError(
                "Active cases must have "
                "a next hearing date."
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = CourtGenerator()

    generator.run()