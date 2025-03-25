from apps.lists.models import List
from apps.lists.serializers import (
    ListSerializer,
    ListCreateSerializer,
    ListUpdateSerializer,
)

from utils.viewsets import BaseViewSet


class ListViewSet(BaseViewSet):

    def get_queryset(self):
        return List.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return ListCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return ListUpdateSerializer
        return ListSerializer
