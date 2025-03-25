from django.db import models
from apps.categories.models import Category


class Structure(models.Model):
    category_id = models.ForeignKey(
        Category, related_name="get_structures_category", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    path = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Structure"
        verbose_name_plural = "Structures"
