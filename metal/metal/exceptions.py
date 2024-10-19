class FirebaseError(Exception):
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class AuthError(FirebaseError):
    pass

class DatabaseError(FirebaseError):
    pass

class UserNotFoundError(AuthError):
    def __init__(self, message=None):
        if not message:
            message = "User not found"
        super().__init__(message, 404)

class ExpiredIdTokenError(AuthError):
    def __init__(self, message=None):
        if not message:
            message = "Expired ID token"
        super().__init__(message, 401)

class InvalidIdTokenError(AuthError):
    def __init__(self, message=None):
        if not message:
            message = "Invalid ID token"
        super().__init__(message, 401)

class InsufficientPermissionError(AuthError):
    def __init__(self, message=None):
        if not message:
            message = "Insufficient permission"
        super().__init__(message, 403)

class EmailAlreadyExistsError(AuthError):
    def __init__(self, message=None):
        if not message:
            message = "Email already exists"
        super().__init__(message, 409)

class PhoneNumberAlreadyExistsError(AuthError):
    def __init__(self, message=None):
        if not message:
            message = "Phone number already exists"
        super().__init__(message, 409)

class InvalidArgumentError(FirebaseError):
    def __init__(self, message):
        super().__init__(f"Invalid argument: {message}", 400)

class TooManyRequestsError(FirebaseError):
    def __init__(self, message=None):
        if not message:
            message = "Too many requests"
        super().__init__(message, 429)

class InternalError(FirebaseError):
    def __init__(self, message=None):
        if not message:
            message = "Internal server error"
        super().__init__(message, 500)
