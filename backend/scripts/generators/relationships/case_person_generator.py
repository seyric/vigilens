class CasePersonGenerator(BaseGenerator):

    def __init__(self):

        super().__init__("case_persons.csv")

    def load_dependencies(self):

        self.cases = self.dataset_loader.get_generated(
            "cases"
        )

        self.persons = self.dataset_loader.get_generated(
            "persons"
        )

    def generate(self):

        self.records = []

        for case in self.cases:

            self.records.extend(
                self._generate_relationships(case)
            )

    def validate(self):

        relationship_ids = set()

        for record in self.records:

            if record["relationship_id"] in relationship_ids:

                raise ValueError(
                    "Duplicate Relationship ID"
                )

            relationship_ids.add(
                record["relationship_id"]
            )

            # ======================================================
# Relationship Generator
# ======================================================

def _generate_relationships(self, case):

    records = []

    roles = {

        "Complainant": 1,

        "Investigating Officer": 1,

        "Victim": random.randint(1, 3),

        "Suspect": random.randint(1, 5),

        "Witness": random.randint(0, 8),

        "Informant": random.randint(0, 2)

    }

    used_people = set()

    for role, count in roles.items():

        for _ in range(count):

            person = random.choice(self.persons)

            while person["person_id"] in used_people:

                person = random.choice(
                    self.persons
                )

            used_people.add(
                person["person_id"]
            )

            records.append(

                {

                    "relationship_id":
                        self.id_generator.generate("REL"),

                    "case_id":
                        case["case_id"],

                    "person_id":
                        person["person_id"],

                    "role":
                        role,

                    "assigned_date":
                        self._generate_assigned_date(),

                    "status":
                        "Active"

                }

            )

    return records

    def _generate_assigned_date(self):

    today = date.today()

    days = random.randint(
        0,
        365
    )

    assigned = today - timedelta(
        days=days
    )

    return assigned.isoformat()
