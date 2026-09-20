from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class EmailGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = (
            "Email Generator"
        )

        self.output_file = (
            self.generated_dir /
            "emails.csv"
        )
def load_dependencies(self):

    self.persons = self.dataset_loader.get_generated(
        "persons"
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

    suspects = [

        relation

        for relation in self.case_persons

        if relation["role"] == "Suspect"

    ]

    for suspect in suspects:

        email_count = self.random.randint(
            10,
            40
        )

        for _ in range(email_count):

            self.records.append(

                self._generate_email(

                    suspect

                )

            )
def _generate_email(
    self,
    suspect
):

    sender_email = (
        self._generate_email_address(
            suspect["person_id"]
        )
    )

    receivers = [

        relation

        for relation in self.case_persons

        if relation["person_id"]
        != suspect["person_id"]

    ]

    receiver = self.random.choice(
        receivers
    )

    receiver_email = (
        self._generate_email_address(
            receiver["person_id"]
        )
    )

    subject = self._generate_subject()

    return {

        "email_id":
            IDGenerator.generate("EMAIL"),

        "sender_person_id":
            suspect["person_id"],

        "sender_email":
            sender_email,

        "receiver_person_id":
            receiver["person_id"],

        "receiver_email":
            receiver_email,

        "email_datetime":
            self.fake.date_time_between(
                start_date="-180d",
                end_date="now"
            ),

        "subject":
            subject,

        "body":
            self._generate_email_body(
                subject
            ),

        "attachment_type":
            self._generate_attachment_type(),

        "email_status":
            self._generate_email_status(),

        "case_id":
            suspect["case_id"]

    }
def _generate_email_address(
    self,
    person_id
):

    domains = [

        "gmail.com",

        "outlook.com",

        "yahoo.com",

        "proton.me"

    ]

    return (
        f"user{person_id.lower()}"
        f"@{self.random.choice(domains)}"
    )


def _generate_subject(self):

    subjects = [

        "Meeting Schedule",

        "Important Documents",

        "Payment Confirmation",

        "Project Update",

        "Travel Itinerary",

        "Confidential Information",

        "Urgent Action Required",

        "Invoice Attached"

    ]

    return self.random.choice(
        subjects
    )


def _generate_email_body(
    self,
    subject
):

    bodies = {

        "Meeting Schedule":
            "Let's meet tomorrow at the usual place.",

        "Important Documents":
            "Please review the attached documents.",

        "Payment Confirmation":
            "Your payment has been successfully processed.",

        "Project Update":
            "The latest project status is attached.",

        "Travel Itinerary":
            "Sharing the travel details for your reference.",

        "Confidential Information":
            "Keep this information strictly confidential.",

        "Urgent Action Required":
            "Please respond as soon as possible.",

        "Invoice Attached":
            "Kindly find the invoice attached."

    }

    return bodies.get(
        subject,
        "No content available."
    )


def _generate_attachment_type(self):

    return self.random.choices(

        [

            "None",

            "PDF",

            "Image",

            "Spreadsheet",

            "ZIP"

        ],

        weights=[50, 20, 10, 10, 10],

        k=1

    )[0]


def _generate_email_status(self):

    return self.random.choices(

        [

            "Sent",

            "Delivered",

            "Read",

            "Spam"

        ],

        weights=[10, 30, 55, 5],

        k=1

    )[0]
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "email_id",
            "sender_person_id",
            "sender_email",
            "receiver_person_id",
            "receiver_email",
            "email_datetime",
            "subject",
            "body",
            "attachment_type",
            "email_status",
            "case_id"
        ]
    )

    Validators.validate_unique(
        self.records,
        "email_id"
    )

    person_ids = {
        person["person_id"]
        for person in self.persons
    }

    case_ids = {
        case["case_id"]
        for case in self.cases
    }

    valid_attachment_types = {
        "None",
        "PDF",
        "Image",
        "Spreadsheet",
        "ZIP"
    }

    valid_email_status = {
        "Sent",
        "Delivered",
        "Read",
        "Spam"
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
            record["sender_person_id"]
            == record["receiver_person_id"]
        ):
            raise ValueError(
                "Sender and receiver cannot be the same."
            )

        if "@" not in record["sender_email"]:
            raise ValueError(
                f"Invalid sender email: "
                f"{record['sender_email']}"
            )

        if "@" not in record["receiver_email"]:
            raise ValueError(
                f"Invalid receiver email: "
                f"{record['receiver_email']}"
            )

        if (
            record["attachment_type"]
            not in valid_attachment_types
        ):
            raise ValueError(
                f"Invalid attachment type: "
                f"{record['attachment_type']}"
            )

        if (
            record["email_status"]
            not in valid_email_status
        ):
            raise ValueError(
                f"Invalid email status: "
                f"{record['email_status']}"
            )

        if not record["subject"].strip():
            raise ValueError(
                f"Empty subject in "
                f"{record['email_id']}"
            )

        if not record["body"].strip():
            raise ValueError(
                f"Empty body in "
                f"{record['email_id']}"
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = EmailGenerator()

    generator.run()