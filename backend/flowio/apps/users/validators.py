from django.core.exceptions import ValidationError
import re


class PasswordValidator:
    def __call__(self, value):
        if len(value) < 8 or len(value) > 20:
            raise ValidationError("Password must be between 8 and 20 characters long.")

        if not re.search(r"[A-Z]", value):
            raise ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"\d", value):
            raise ValidationError("Password must contain at least one number.")

        if not re.search(r"[\W_]", value):
            raise ValidationError(
                "Password must contain at least one special character."
            )
