# Custom authentication and authorization exceptions.
# AuthError: Base catch-all exception.
# InvalidTokenError: Raised when signature is invalid or format is malformed.
# ExpiredTokenError: Raised when the token has expired.
# InvalidCredentialsError: Raised when password/credentials check fails.
# InactiveUserError: Raised when an authenticated user is inactive.
# InsufficientPermissionError: Raised when a user lacks permission or falls outside geographic scope.

class AuthError(Exception): pass
class InvalidTokenError(AuthError): pass
class ExpiredTokenError(InvalidTokenError): pass
class InvalidCredentialsError(AuthError): pass
class InactiveUserError(AuthError): pass
class InsufficientPermissionError(AuthError): pass
