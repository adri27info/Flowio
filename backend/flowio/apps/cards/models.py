from django.db import models

from apps.lists.models import List


class Card(models.Model):
    list_id = models.ForeignKey(
        List, related_name="get_cards_list", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Card"
        verbose_name_plural = "Cards"
