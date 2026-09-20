from scripts.generators.core.base_generator import BaseGenerator
from scripts.utils.id_generator import IDGenerator
from scripts.utils.validators import Validators


class DeviceGenerator(BaseGenerator):

    def __init__(self):

        super().__init__()

        self.generator_name = (
            "Device Generator"
        )

        self.output_file = (
            self.generated_dir /
            "devices.csv"
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

    self.lookup = self.lookup_loader
def generate(self):

    self.records = []

    phone_lookup = {

        phone["person_id"]: phone

        for phone in self.phones

    }

    for person in self.persons:

        if person["person_id"] not in phone_lookup:

            continue

        device_count = self.random.randint(
            1,
            3
        )

        for _ in range(device_count):

            self.records.append(

                self._generate_device(

                    person,

                    phone_lookup[
                        person["person_id"]
                    ]

                )

            )
def _generate_device(
    self,
    person,
    phone
):

    device_type = self._generate_device_type()

    brand = self._generate_brand(
        device_type
    )

    operating_system = (
        self._generate_operating_system(
            device_type,
            brand
        )
    )

    return {

        "device_id":
            IDGenerator.generate("DEV"),

        "person_id":
            person["person_id"],

        "phone_number":
            phone["phone_number"],

        "imei":
            self._generate_imei(),

        "device_type":
            device_type,

        "brand":
            brand,

        "model":
            self._generate_model(
                brand
            ),

        "operating_system":
            operating_system,

        "mac_address":
            self._generate_mac_address(),

        "ip_address":
            self._generate_ip_address(),

        "status":
            self._generate_status()

    }
def _generate_device_type(self):

    return self.random.choices(

        [

            "Smartphone",

            "Laptop",

            "Tablet"

        ],

        weights=[70, 20, 10],

        k=1

    )[0]


def _generate_brand(
    self,
    device_type
):

    brands = {

        "Smartphone": [

            "Samsung",

            "Apple",

            "OnePlus",

            "Xiaomi",

            "Realme",

            "Motorola",

            "Vivo",

            "Oppo"

        ],

        "Laptop": [

            "Dell",

            "HP",

            "Lenovo",

            "Apple",

            "Asus",

            "Acer"

        ],

        "Tablet": [

            "Apple",

            "Samsung",

            "Lenovo",

            "Xiaomi"

        ]

    }

    return self.random.choice(
        brands[device_type]
    )


def _generate_model(
    self,
    brand
):

    return (
        brand
        + " "
        + str(
            self.random.randint(
                1,
                20
            )
        )
    )


def _generate_operating_system(
    self,
    device_type,
    brand
):

    if brand == "Apple":

        return self.random.choice(

            [

                "iOS 18",

                "macOS Sequoia",

                "iPadOS 18"

            ]

        )

    if device_type == "Laptop":

        return self.random.choice(

            [

                "Windows 11",

                "Ubuntu 24.04"

            ]

        )

    return self.random.choice(

        [

            "Android 13",

            "Android 14",

            "Android 15"

        ]

    )


def _generate_imei(self):

    return "".join(

        str(
            self.random.randint(
                0,
                9
            )
        )

        for _ in range(15)

    )


def _generate_mac_address(self):

    return ":".join(

        f"{self.random.randint(0,255):02X}"

        for _ in range(6)

    )


def _generate_ip_address(self):

    return ".".join(

        str(
            self.random.randint(
                1,
                254
            )
        )

        for _ in range(4)

    )


def _generate_status(self):

    return self.random.choice(

        [

            "Active",

            "Inactive",

            "Seized",

            "Under Forensic Analysis"

        ]

    )
    def validate(self):

    super().validate()

    Validators.validate_required_fields(
        self.records,
        [
            "device_id",
            "person_id",
            "phone_number",
            "imei",
            "device_type",
            "brand",
            "model",
            "operating_system",
            "mac_address",
            "ip_address",
            "status"
        ]
    )

    Validators.validate_unique(
        self.records,
        "device_id"
    )

    Validators.validate_unique(
        self.records,
        "imei"
    )

    person_ids = {
        person["person_id"]
        for person in self.persons
    }

    phone_lookup = {
        phone["person_id"]: phone["phone_number"]
        for phone in self.phones
    }

    valid_device_types = {

        "Smartphone",

        "Laptop",

        "Tablet"

    }

    valid_status = {

        "Active",

        "Inactive",

        "Seized",

        "Under Forensic Analysis"

    }

    for record in self.records:

        if record["person_id"] not in person_ids:

            raise ValueError(
                f"Invalid Person ID: "
                f"{record['person_id']}"
            )

        if (
            record["phone_number"]
            != phone_lookup[
                record["person_id"]
            ]
        ):

            raise ValueError(
                f"Phone number mismatch "
                f"in {record['device_id']}"
            )

        if len(record["imei"]) != 15:

            raise ValueError(
                f"Invalid IMEI: "
                f"{record['imei']}"
            )

        if (
            record["device_type"]
            not in valid_device_types
        ):

            raise ValueError(
                f"Invalid device type: "
                f"{record['device_type']}"
            )

        if (
            record["status"]
            not in valid_status
        ):

            raise ValueError(
                f"Invalid status: "
                f"{record['status']}"
            )
def run(self):

    self.load_dependencies()

    self.generate()

    self.validate()

    self.save()


if __name__ == "__main__":

    generator = DeviceGenerator()

    generator.run()