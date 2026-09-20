from datetime import timedelta

from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class CDRGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = (
            "CDR Generator"
        )

        self.output_file = (
            self.generated_dir /
            "cdr_records.csv"
        )
def load_dependencies(self):

    self.persons = self.dataset_loader.get_generated(
        "persons"
    )

    self.phones = self.dataset_loader.get_generated(
        "phones"
    )

    self.case_persons = self.dataset_loader.get_generated(
        "case_person_relationships"
    )

    self.cases = self.dataset_loader.get_generated(
        "cases"
    )

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    phone_lookup = {

        phone["person_id"]: phone

        for phone in self.phones

    }

    suspects = [

        relation

        for relation in self.case_persons

        if relation["role"] == "Suspect"

    ]

    for suspect in suspects:

        if suspect["person_id"] not in phone_lookup:

            continue

        call_count = self.random.randint(
            20,
            80
        )

        for _ in range(call_count):

            self.records.append(

                self._generate_call_record(

                    suspect,

                    phone_lookup

                )

            )
def _generate_call_record(
    self,
    suspect,
    phone_lookup
):

    caller = phone_lookup[
        suspect["person_id"]
    ]

    available_receivers = [

        phone

        for phone in self.phones

        if phone["person_id"] != suspect["person_id"]

    ]

    receiver = self.random.choice(
        available_receivers
    )

    call_time = self.fake.date_time_between(
        start_date="-180d",
        end_date="now"
    )

    call_status = self._generate_call_status()

    duration = (
        self._generate_call_duration()
        if call_status == "Connected"
        else 0
    )

    return {

        "cdr_id":
            IDGenerator.generate("CDR"),

        "caller_person_id":
            suspect["person_id"],

        "caller_number":
            caller["phone_number"],

        "receiver_person_id":
            receiver["person_id"],

        "receiver_number":
            receiver["phone_number"],

        "call_datetime":
            call_time,

        "call_duration":
            duration,

        "call_type":
            self._generate_call_type(),

        "cell_tower":
            self._generate_cell_tower(),

        "call_status":
            call_status,

        "case_id":
            suspect["case_id"]

    }
def _generate_call_duration(self):

    return self.random.randint(
        5,
        3600
    )


def _generate_call_type(self):

    return self.random.choice(

        [

            "Incoming",

            "Outgoing"

        ]

    )


def _generate_call_status(self):

    return self.random.choices(

        [

            "Connected",

            "Missed",

            "Rejected",

            "Busy"

        ],

        weights=[
            75,
            10,
            10,
            5
        ],

        k=1

    )[0]


def _generate_cell_tower(self):

    towers = [

        "BTM Layout Tower",

        "Whitefield Tower",

        "Electronic City Tower",

        "Koramangala Tower",

        "Indiranagar Tower",

        "Yelahanka Tower",

        "Hebbal Tower",

        "Jayanagar Tower",

        "MG Road Tower",

        "Banashankari Tower"

    ]

    return self.random.choice(
        towers
    )
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "cdr_id",
            "caller_person_id",
            "caller_number",
            "receiver_person_id",
            "receiver_number",
            "call_datetime",
            "call_duration",
            "call_type",
            "cell_tower",
            "call_status",
            "case_id"
        ]
    )

    Validators.validate_unique(
        self.records,
        "cdr_id"
    )

    person_ids = {
        person["person_id"]
        for person in self.persons
    }

    phone_lookup = {
        phone["person_id"]: phone["phone_number"]
        for phone in self.phones
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    valid_call_types = {

        "Incoming",

        "Outgoing"

    }

    valid_call_status = {

        "Connected",

        "Missed",

        "Rejected",

        "Busy"

    }

    for record in self.records:

        if record["caller_person_id"] not in person_ids:

            raise ValueError(
                f"Invalid caller person ID: "
                f"{record['caller_person_id']}"
            )

        if record["receiver_person_id"] not in person_ids:

            raise ValueError(
                f"Invalid receiver person ID: "
                f"{record['receiver_person_id']}"
            )

        if record["case_id"] not in case_ids:

            raise ValueError(
                f"Invalid case ID: "
                f"{record['case_id']}"
            )

        if (
            record["caller_number"]
            != phone_lookup[
                record["caller_person_id"]
            ]
        ):

            raise ValueError(
                f"Caller number mismatch "
                f"in {record['cdr_id']}"
            )

        if (
            record["receiver_number"]
            != phone_lookup[
                record["receiver_person_id"]
            ]
        ):

            raise ValueError(
                f"Receiver number mismatch "
                f"in {record['cdr_id']}"
            )

        if (
            record["caller_person_id"]
            == record["receiver_person_id"]
        ):

            raise ValueError(
                "Caller and receiver "
                "cannot be the same."
            )

        if (
            record["call_type"]
            not in valid_call_types
        ):

            raise ValueError(
                f"Invalid call type: "
                f"{record['call_type']}"
            )

        if (
            record["call_status"]
            not in valid_call_status
        ):

            raise ValueError(
                f"Invalid call status: "
                f"{record['call_status']}"
            )

        if (
            record["call_status"] == "Connected"
            and record["call_duration"] <= 0
        ):

            raise ValueError(
                "Connected calls must "
                "have positive duration."
            )

        if (
            record["call_status"] != "Connected"
            and record["call_duration"] != 0
        ):

            raise ValueError(
                "Missed/Rejected/Busy "
                "calls must have "
                "zero duration."
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = CDRGenerator()

    generator.run()