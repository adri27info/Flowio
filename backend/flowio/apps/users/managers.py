from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    def _create_user(
        self, email, name, surnames, password, is_staff, is_superuser, **extra_fields
    ):
        if not email:
            raise ValueError("The email field must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            surnames=surnames,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, name, surnames, password=None, **extra_fields):
        return self._create_user(
            email, name, surnames, password, False, False, **extra_fields
        )

    def create_superuser(self, email, name, surnames, password=None, **extra_fields):
        return self._create_user(
            email, name, surnames, password, True, True, **extra_fields
        )
