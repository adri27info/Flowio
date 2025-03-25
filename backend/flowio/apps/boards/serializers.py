from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.boards.models import Board
from apps.structures.models import Structure
from apps.workspaces.models import Workspace
from apps.structures.serializers import StructureSerializer
from apps.lists.serializers import ListSerializer


class BoardSerializer(serializers.ModelSerializer):
    workspace = serializers.PrimaryKeyRelatedField(read_only=True)
    structure = StructureSerializer(source="structure_id")
    lists = ListSerializer(many=True, read_only=True, source="get_lists_board")

    class Meta:
        model = Board
        exclude = ["structure_id"]


class BoardCreateSerializer(serializers.ModelSerializer):
    workspace_id = serializers.PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),
    )
    structure_id = serializers.PrimaryKeyRelatedField(
        queryset=Structure.objects.all(),
    )

    class Meta:
        model = Board
        fields = [
            "id",
            "name",
            "description",
            "workspace_id",
            "structure_id",
        ]


class BoardUpdateSerializer(serializers.ModelSerializer):
    workspace_id = serializers.PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),
    )
    structure_id = serializers.PrimaryKeyRelatedField(
        queryset=Structure.objects.all(),
        required=False,
        allow_null=True,
    )

    def validate_structure_id(self, value):
        if value is None:
            raise ValidationError("You must choose a structure")
        return value

    class Meta:
        model = Board
        fields = [
            "name",
            "description",
            "workspace_id",
            "structure_id",
        ]
