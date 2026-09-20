from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class WhatsAppGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = (
            "WhatsApp Generator"
        )

        self.output_file = (
            self.generated_dir /
            "whatsapp_messages.csv"
        )
def load_dependencies(self):

    self.persons = self.dataset_loader.get_generated(
        "persons"
    )

    self.phones = self.dataset_loader.get_generated(
        "phones"
    )

    self.devices = self.dataset_loader.get_generated(
        "devices"
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

        message_count = self.random.randint(
            30,
            120
        )

        for _ in range(message_count):

            self.records.append(

                self._generate_message(

                    suspect,

                    phone_lookup

                )

            )
def _generate_message(
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

    media_type = (
        self._generate_media_type(
            message_type
        )
    )

    return {

        "message_id":
            IDGenerator.generate("WA"),

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

        "media_type":
            media_type,

        "is_group_message":
            self.random.choices(
                [True, False],
                weights=[20, 80],
                k=1
            )[0],

        "case_id":
            suspect["case_id"]

    }
def _generate_message_type(self):

    return self.random.choices(

        [

            "Text",

            "Image",

            "Video",

            "Document",

            "Voice Note",

            "Location"

        ],

        weights=[55, 15, 10, 8, 7, 5],

        k=1

    )[0]


def _generate_media_type(
    self,
    message_type
):

    media_map = {

        "Text": "None",

        "Image": "Image",

        "Video": "Video",

        "Document": "PDF",

        "Voice Note": "Audio",

        "Location": "Location"

    }

    return media_map[
        message_type
    ]


def _generate_message_content(
    self,
    message_type
):

    messages = {

        "Text": [

            "Reached the location.",

            "Call me when you arrive.",

            "Everything is ready.",

            "See you tomorrow.",

            "Meeting postponed."

        ],

        "Image": [

            "Shared an image.",

            "Photo attached."

        ],

        "Video": [

            "Shared a video.",

            "Video attachment."

        ],

        "Document": [

            "Document shared.",

            "Please check the PDF."

        ],

        "Voice Note": [

            "Voice message.",

            "Audio recording."

        ],

        "Location": [

            "Live location shared.",

            "Current location."

        ]

    }

    return self.random.choice(
        messages[
            message_type
        ]
    )


def _generate_delivery_status(self):

    return self.random.choices(

        [

            "Sent",

            "Delivered",

            "Read"

        ],

        weights=[10, 35, 55],

        k=1

    )[0]
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "message_id",
            "sender_person_id",
            "sender_number",
            "receiver_person_id",
            "receiver_number",
            "message_datetime",
            "message_type",
            "message_content",
            "delivery_status",
            "media_type",
            "is_group_message",
            "case_id"
        ]
    )

    Validators.validate_unique(
        self.records,
        "message_id"
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
        "Text",
        "Image",
        "Video",
        "Document",
        "Voice Note",
        "Location"
    }

    valid_delivery_status = {
        "Sent",
        "Delivered",
        "Read"
    }

    valid_media_types = {
        "None",
        "Image",
        "Video",
        "PDF",
        "Audio",
        "Location"
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
                f"Sender number mismatch in "
                f"{record['message_id']}"
            )

        if (
            record["receiver_number"]
            != phone_lookup[
                record["receiver_person_id"]
            ]
        ):
            raise ValueError(
                f"Receiver number mismatch in "
                f"{record['message_id']}"
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
            record["media_type"]
            not in valid_media_types
        ):
            raise ValueError(
                f"Invalid media type: "
                f"{record['media_type']}"
            )

        if (
            not isinstance(
                record["is_group_message"],
                bool
            )
        ):
            raise ValueError(
                f"is_group_message must be boolean "
                f"in {record['message_id']}"
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = WhatsAppGenerator()

    generator.run()