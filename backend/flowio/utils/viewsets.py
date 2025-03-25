from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from utils.permissions import IsAdminOrSelf


class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsAdminOrSelf]
