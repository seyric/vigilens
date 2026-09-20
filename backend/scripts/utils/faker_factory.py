from faker import Faker
import random

# Global seed for reproducibility
SEED = 42

random.seed(SEED)
Faker.seed(SEED)

# Indian locale
fake = Faker("en_IN")


def get_fake():
    """
    Returns a seeded Faker instance.
    """
    return fake