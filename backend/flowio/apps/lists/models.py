from django.db import models
from apps.boards.models import Board


class List(models.Model):
    board_id = models.ForeignKey(
        Board, related_name="get_lists_board", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)

    class Meta:
        verbose_name = "List"
        verbose_name_plural = "Lists"
