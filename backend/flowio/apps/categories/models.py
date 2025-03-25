from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
