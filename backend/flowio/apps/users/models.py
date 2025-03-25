import os
import uuid

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import UserManager
from apps.roles.models import Role
from apps.cards.models import Card


def user_attachment_path(instance, filename):
    """
    Generates a unique name for uploaded files based on the original file name
    and a UUID. This ensures there are no filename collisions, even if the same
    file is uploaded multiple times.

    Args:
    instance: The model instance associated with the file being uploaded.
    filename (str): The original name of the uploaded file.
    """
    name, ext = os.path.splitext(filename)
    unique_id = uuid.uuid4().hex
    unique_filename = f"{name}_{unique_id}{ext}"
    return os.path.join("attachments", "user", str(instance.id), unique_filename)


class User(AbstractBaseUser, PermissionsMixin):
    role_id = models.ForeignKey(
        Role, related_name="get_users_role", on_delete=models.CASCADE
    )
    cards = models.ManyToManyField(Card, related_name="get_users_cards", blank=True)
    attachment = models.FileField(
        upload_to=user_attachment_path,
        blank=True,
        null=True,
        default="attachments/user/default/user_default.png",
    )
    name = models.CharField(max_length=255)
    surnames = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    activation_code = models.CharField(max_length=5, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    registration_attempts = models.PositiveIntegerField(default=0)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "surnames"]


class BlacklistedToken(models.Model):
    user_id = models.ForeignKey(
        User, related_name="get_blacklisted_tokens_user", on_delete=models.CASCADE
    )
    refresh_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "BlacklistedToken"
        verbose_name_plural = "BlacklistedTokens"
