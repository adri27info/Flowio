from apps.traces.models import Trace
from apps.traces.serializers import (
    TraceSerializer,
    TraceCreateSerializer,
    TraceUpdateSerializer,
)

from utils.viewsets import BaseViewSet


class TraceViewSet(BaseViewSet):
    def get_queryset(self):
        return Trace.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return TraceCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return TraceUpdateSerializer
        return TraceSerializer
