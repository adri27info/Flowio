from django.db import models
from apps.cards.models import Card
from apps.users.models import User


class Trace(models.Model):
    user_id = models.ForeignKey(
        User, related_name="get_traces_user", on_delete=models.CASCADE
    )
    card_id = models.ForeignKey(
        Card, related_name="get_traces_card", on_delete=models.CASCADE
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Trace"
        verbose_name_plural = "Traces"
