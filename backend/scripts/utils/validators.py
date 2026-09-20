def validate_required(value, field_name):
    if value is None or value == "":
        raise ValueError(f"{field_name} cannot be empty")


def validate_positive(number, field_name):
    if number < 0:
        raise ValueError(f"{field_name} must be positive")