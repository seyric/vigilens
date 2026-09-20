from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class EvidenceGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = "Evidence Generator"

        self.output_file = (
            self.generated_dir /
            "evidence.csv"
        )
def load_dependencies(self):

    self.firs = self.dataset_loader.get_generated(
        "firs"
    )

    self.cases = self.dataset_loader.get_generated(
        "cases"
    )

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    for fir in self.firs:

        evidence_count = self.random.randint(
            1,
            5
        )

        for _ in range(evidence_count):

            self.records.append(
                self._generate_evidence(fir)
            )
def _generate_evidence(
    self,
    fir
):

    evidence_type = self.random.choice(
        self.lookup.evidence.EVIDENCE_TYPES
    )

    collection_time = (
        fir["registration_datetime"]
        + timedelta(
            minutes=self.random.randint(
                15,
                180
            )
        )
    )

    return {

        "evidence_id":
            IDGenerator.generate("EVD"),

        "fir_id":
            fir["fir_id"],

        "case_id":
            fir["case_id"],

        "evidence_type":
            evidence_type,

        "description":
            self._generate_description(
                evidence_type
            ),

        "collected_by":
            self.fake.name(),

        "collection_datetime":
            collection_time,

        "storage_location":
        self._generate_storage_location(),

        "forensic_status":
            self._generate_forensic_status(),

        "chain_of_custody":
            self._generate_chain_of_custody()

    }


def _generate_description(
    self,
    evidence_type
):

    descriptions = {

        "Fingerprint":
            "Fingerprint recovered from the crime scene.",

        "DNA":
            "DNA sample collected for forensic examination.",

        "Weapon":
            "Weapon seized during investigation.",

        "Mobile Phone":
            "Mobile phone recovered from the suspect.",

        "CCTV Footage":
            "CCTV footage collected from nearby premises.",

        "Document":
            "Relevant document seized during investigation.",

        "Vehicle":
            "Vehicle linked to the offence has been seized.",

        "Cash":
            "Cash recovered during search operation.",

        "Laptop":
            "Laptop seized for digital forensic analysis.",

        "Hard Disk":
            "Hard disk collected for forensic examination.",

        "Blood Sample":
            "Blood sample collected from the crime scene.",

        "Clothing":
            "Clothing recovered for forensic testing."

    }

    return descriptions.get(
        evidence_type,
        f"{evidence_type} collected as evidence."
    )


def _generate_storage_location(self):

    return self.random.choice(
        self.lookup.evidence.STORAGE_LOCATIONS
    )


def _generate_forensic_status(self):

    return self.random.choice(
        self.lookup.evidence.FORENSIC_STATUS
    )


def _generate_chain_of_custody(self):

    statuses = [

        "Maintained",

        "Transferred to FSL",

        "Under Examination",

        "Returned to Evidence Locker"

    ]

    return self.random.choice(statuses)

def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "evidence_id",
            "fir_id",
            "case_id",
            "evidence_type",
            "description",
            "collected_by",
            "collection_datetime",
            "storage_location",
            "forensic_status",
            "chain_of_custody"
        ]
    )

    Validators.validate_unique(
        self.records,
        "evidence_id"
    )

    fir_ids = {
        fir["fir_id"]
        for fir in self.firs
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
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

    fir_lookup = {
        fir["fir_id"]: fir
        for fir in self.firs
    }

    for record in self.records:

        fir = fir_lookup[record["fir_id"]]

        if (
            record["collection_datetime"]
            < fir["registration_datetime"]
        ):

            raise ValueError(
                f"Evidence {record['evidence_id']} "
                "has an invalid collection time."
            )

    valid_status = set(
        self.lookup.evidence.FORENSIC_STATUS
    )

    for record in self.records:

        if (
            record["forensic_status"]
            not in valid_status
        ):

            raise ValueError(
                f"Invalid forensic status: "
                f"{record['forensic_status']}"
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = EvidenceGenerator()

    generator.run()