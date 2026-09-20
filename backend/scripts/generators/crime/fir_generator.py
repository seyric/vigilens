from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class FIRGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = "FIR Generator"

        self.output_file = self.generated_dir / "firs.csv"

        self.firs = []

def load_dependencies(self):

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

    for case in self.cases:

        self.records.append(
            self._generate_fir(case)
        )

def _generate_fir(self, case):

    complainant = next(

        relation

        for relation in self.case_persons

        if relation["case_id"] == case["case_id"]

        and relation["role"] == "Complainant"

    )

    incident_time = case["incident_date"]

    registration_time = self._generate_registration_datetime(
        incident_time
    )

    return {

        "fir_id":
            IDGenerator.generate("FIR"),

        "fir_number":
            self._generate_fir_number(case),

        "case_id":
            case["case_id"],

        "complainant_id":
            complainant["person_id"],

        "police_station":
            case["police_station"],

        "incident_datetime":
            incident_time,

        "registration_datetime":
            registration_time,

        "crime_type":
            case["crime_type"],

        "legal_sections":
            self._generate_legal_sections(
                case["crime_type"]
            ),

        "fir_type":
            self._generate_fir_type(
                case["crime_type"]
            ),

        "status":
            "Registered",

        "description":
            self._generate_description(case)

    }
def _generate_fir_number(self, case):

    district = case["district"][:3].upper()

    return (
        f"FIR/"
        f"2026/"
        f"{district}/"
        f"{case['case_id'][-6:]}"
    )
def _generate_registration_datetime(
    self,
    incident_time
):

    delay = self.random.randint(
        30,
        720
    )

    return incident_time + timedelta(
        minutes=delay
    )
def _generate_fir_type(
    self,
    crime_type
):

    cognizable = {

        "Murder",

        "Theft",

        "Robbery",

        "Kidnapping",

        "Cyber Fraud"

    }

    if crime_type in cognizable:

        return "Cognizable"

    return "Non-Cognizable"

def _generate_fir_type(
    self,
    crime_type
):

    cognizable = {

        "Murder",

        "Theft",

        "Robbery",

        "Kidnapping",

        "Cyber Fraud"

    }

    if crime_type in cognizable:

        return "Cognizable"

    return "Non-Cognizable" 
    def _generate_description(
    self,
    case
):

    return (

        f"{case['crime_type']} "

        f"reported at "

        f"{case['police_station']} "

        f"under case "

        f"{case['case_number']}."

    )
    def _generate_description(
    self,
    case
):

    return (

        f"{case['crime_type']} "

        f"reported at "

        f"{case['police_station']} "

        f"under case "

        f"{case['case_number']}."

    )
    def validate(self):

    super().validate()

    # Validate required fields
    Validators.validate_required_fields(
        self.records,
        
        [
            "fir_id",
            "fir_number",
            "case_id",
            "complainant_id",
            "police_station",
            "incident_datetime",
            "registration_datetime",
            "crime_type",
            "legal_sections",
            "fir_type",
            "status",
            "description"
        ]
    )

    # FIR ID must be unique
    Validators.validate_unique(
        self.records,
        "fir_id", 
        "case_id"
    )

    # FIR Number must be unique
    Validators.validate_unique(
        self.records,
        "fir_number"
    )

    # Registration time must not be before incident time
    for record in self.records:

        if (
            record["registration_datetime"]
            < record["incident_datetime"]
        ):
            raise ValueError(
                f"Invalid FIR {record['fir_id']}: "
                "registration time cannot be before incident time."
            )

    # Every case_id must exist
    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    for record in self.records:

        if record["case_id"] not in case_ids:
            raise ValueError(
                f"Invalid case_id: {record['case_id']}"
            )

    # Every complainant_id must exist
    person_ids = {
        person["person_id"]
        for person in self.persons
    }

    for record in self.records:

        if record["complainant_id"] not in person_ids:
            raise ValueError(
                f"Invalid complainant_id: {record['complainant_id']}"
            )