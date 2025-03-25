from django.db import models


class Workspace(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    user_id = models.ForeignKey(
        "users.User", related_name="get_workspaces_user", on_delete=models.CASCADE
    )
    background_workspace_id = models.ForeignKey(
        "background_workspaces.BackgroundWorkspace",
        related_name="get_workspaces_background_workspace",
        on_delete=models.SET_NULL,
        null=True,
        blank=False,
    )

    class Meta:
        verbose_name = "Workspace"
        verbose_name_plural = "Workspaces"
