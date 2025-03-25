import django_filters

from django_filters.rest_framework import DjangoFilterBackend

from apps.workspaces.models import Workspace
from apps.workspaces.serializers import (
    WorkspaceSerializer,
    WorkspaceCreateSerializer,
    WorkspaceUpdateSerializer,
)

from utils.viewsets import BaseViewSet


class WorkspaceFilter(django_filters.FilterSet):
    user_id = django_filters.NumberFilter(field_name="user_id", lookup_expr="exact")

    class Meta:
        model = Workspace
        fields = ["user_id"]


class WorkspaceViewSet(BaseViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_class = WorkspaceFilter

    def get_queryset(self):
        return Workspace.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return WorkspaceCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return WorkspaceUpdateSerializer
        return WorkspaceSerializer
