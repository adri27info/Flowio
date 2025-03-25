from rest_framework import serializers

from apps.background_workspaces.models import BackgroundWorkspace


class BackgroundWorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackgroundWorkspace
        fields = "__all__"
