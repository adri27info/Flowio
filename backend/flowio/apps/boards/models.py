from django.db import models
from apps.workspaces.models import Workspace
from apps.structures.models import Structure


class Board(models.Model):
    workspace_id = models.ForeignKey(
        Workspace, related_name="get_boards_workspace", on_delete=models.CASCADE
    )
    structure_id = models.ForeignKey(
        Structure,
        related_name="get_boards_structure",
        on_delete=models.SET_NULL,
        null=True,
        blank=False,
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    favorite = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Board"
        verbose_name_plural = "Boards"
