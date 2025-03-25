from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.background_workspaces.models import BackgroundWorkspace
from apps.background_workspaces.serializers import BackgroundWorkspaceSerializer


class BackgroundWorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = BackgroundWorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BackgroundWorkspace.objects.all()
