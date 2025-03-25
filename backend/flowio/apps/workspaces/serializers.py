from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.workspaces.models import Workspace
from apps.users.models import User
from apps.background_workspaces.models import BackgroundWorkspace
from apps.boards.serializers import BoardSerializer
from apps.background_workspaces.serializers import BackgroundWorkspaceSerializer
from apps.users.serializers import UserSerializer


class WorkspaceSerializer(serializers.ModelSerializer):
    user = UserSerializer(source="user_id")
    background_workspace = BackgroundWorkspaceSerializer(
        source="background_workspace_id"
    )
    boards = BoardSerializer(source="get_boards_workspace", many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = ["id", "name", "description", "user", "background_workspace", "boards"]


class WorkspaceCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
    )
    background_workspace_id = serializers.PrimaryKeyRelatedField(
        queryset=BackgroundWorkspace.objects.all(),
    )

    class Meta:
        model = Workspace
        fields = [
            "name",
            "description",
            "user_id",
            "background_workspace_id",
        ]


class WorkspaceUpdateSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
    )
    background_workspace_id = serializers.PrimaryKeyRelatedField(
        queryset=BackgroundWorkspace.objects.all(),
        required=False,
        allow_null=True,
    )

    def validate_background_workspace_id(self, value):
        if value is None:
            raise ValidationError("You must choose a background workspace")
        return value

    class Meta:
        model = Workspace
        fields = [
            "name",
            "description",
            "user_id",
            "background_workspace_id",
        ]
