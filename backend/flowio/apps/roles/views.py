from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.roles.models import Role
from apps.roles.serializers import RoleSerializer


class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Role.objects.all()
