from apps.users.models import User
from apps.users.serializers import (
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
)

from utils.viewsets import BaseViewSet


class UserViewSet(BaseViewSet):

    def get_queryset(self):
        return User.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return UserUpdateSerializer
        return UserSerializer
