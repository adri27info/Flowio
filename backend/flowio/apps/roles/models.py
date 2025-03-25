from django.db import models


class Role(models.Model):
    name = models.CharField(max_length=20, unique=True)

    class Meta:
        verbose_name = "Role"
        verbose_name_plural = "Roles"
