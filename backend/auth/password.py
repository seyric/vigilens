# Password hashing and verification using pwdlib.
# hash_password: hashes a plain text password using Argon2id.
# verify_password: verifies a plain text password against a stored hash.
from pwdlib import PasswordHash

password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hasher.verify(password, hashed_password)