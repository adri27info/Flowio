from django.db import models


class BackgroundWorkspace(models.Model):
    gradient_theme = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Background Workspace"
        verbose_name_plural = "Background Workspaces"
