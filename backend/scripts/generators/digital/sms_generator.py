from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class SMSGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = (
            "SMS Generator"
        )

        self.output_file = (
            self.generated_dir /
            "sms_records.csv"
        )
def load_dependencies(self):

    self.persons = self.dataset_loader.get_generated(
        "persons"
    )

    self.phones = self.dataset_loader.get_generated(
        "phones"
    )

    self.cases = self.dataset_loader.get_generated(
        "cases"
    )

    self.case_persons = self.dataset_loader.get_generated(
        "case_person_relationships"
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

        sms_count = self.random.randint(
            15,
            60
        )

        for _ in range(sms_count):

            self.records.append(

                self._generate_sms(

                    suspect,

                    phone_lookup

                )

            )
def _generate_sms(
    self,
    suspect,
    phone_lookup
):

    sender = phone_lookup[
        suspect["person_id"]
    ]

    receivers = [

        phone

        for phone in self.phones

        if phone["person_id"]
        != suspect["person_id"]

    ]

    receiver = self.random.choice(
        receivers
    )

    message_type = (
        self._generate_message_type()
    )

    return {

        "sms_id":
            IDGenerator.generate("SMS"),

        "sender_person_id":
            suspect["person_id"],

        "sender_number":
            sender["phone_number"],

        "receiver_person_id":
            receiver["person_id"],

        "receiver_number":
            receiver["phone_number"],

        "message_datetime":
            self.fake.date_time_between(
                start_date="-180d",
                end_date="now"
            ),

        "message_type":
            message_type,

        "message_content":
            self._generate_message_content(
                message_type
            ),

        "delivery_status":
            self._generate_delivery_status(),

        "case_id":
            suspect["case_id"]

    }
def _generate_message_type(self):

    return self.random.choices(

        [

            "Personal",

            "OTP",

            "Banking",

            "Criminal",

            "Promotional"

        ],

        weights=[45, 15, 15, 15, 10],

        k=1

    )[0]


def _generate_message_content(
    self,
    message_type
):

    messages = {

        "Personal": [

            "Call me when you're free.",

            "Reached home safely.",

            "Let's meet tomorrow.",

            "Running late."

        ],

        "OTP": [

            "Your OTP is 482913.",

            "Verification code: 731945.",

            "OTP valid for 10 minutes."

        ],

        "Banking": [

            "₹5,000 debited from your account.",

            "Your account balance has been updated.",

            "Transaction successful."

        ],

        "Criminal": [

            "Meet at the usual location.",

            "Everything is ready.",

            "Delete this message.",

            "Don't answer unknown calls."

        ],

        "Promotional": [

            "Flat 50% OFF today only!",

            "Exclusive offer just for you.",

            "Recharge now and get cashback."

        ]

    }

    return self.random.choice(
        messages[message_type]
    )


def _generate_delivery_status(self):

    return self.random.choices(

        [

            "Delivered",

            "Pending",

            "Failed"

        ],

        weights=[85, 10, 5],

        k=1

    )[0]

    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "sms_id",
            "sender_person_id",
            "sender_number",
            "receiver_person_id",
            "receiver_number",
            "message_datetime",
            "message_type",
            "message_content",
            "delivery_status",
            "case_id"
        ]
    )

    Validators.validate_unique(
        self.records,
        "sms_id"
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

    valid_message_types = {

        "Personal",

        "OTP",

        "Banking",

        "Criminal",

        "Promotional"

    }

    valid_delivery_status = {

        "Delivered",

        "Pending",

        "Failed"

    }

    for record in self.records:

        if record["sender_person_id"] not in person_ids:

            raise ValueError(
                f"Invalid sender person ID: "
                f"{record['sender_person_id']}"
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
            record["sender_number"]
            != phone_lookup[
                record["sender_person_id"]
            ]
        ):

            raise ValueError(
                f"Sender number mismatch "
                f"in {record['sms_id']}"
            )

        if (
            record["receiver_number"]
            != phone_lookup[
                record["receiver_person_id"]
            ]
        ):

            raise ValueError(
                f"Receiver number mismatch "
                f"in {record['sms_id']}"
            )

        if (
            record["sender_person_id"]
            == record["receiver_person_id"]
        ):

            raise ValueError(
                "Sender and receiver "
                "cannot be the same."
            )

        if (
            record["message_type"]
            not in valid_message_types
        ):

            raise ValueError(
                f"Invalid message type: "
                f"{record['message_type']}"
            )

        if (
            record["delivery_status"]
            not in valid_delivery_status
        ):

            raise ValueError(
                f"Invalid delivery status: "
                f"{record['delivery_status']}"
            )

        if (
            not record["message_content"]
            or not record["message_content"].strip()
        ):

            raise ValueError(
                f"Empty message content "
                f"in {record['sms_id']}"
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = SMSGenerator()

    generator.run()