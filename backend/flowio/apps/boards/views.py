from apps.boards.models import Board
from apps.boards.serializers import (
    BoardSerializer,
    BoardCreateSerializer,
    BoardUpdateSerializer,
)

from utils.viewsets import BaseViewSet


class BoardViewSet(BaseViewSet):

    def get_queryset(self):
        return Board.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return BoardCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return BoardUpdateSerializer
        return BoardSerializer
