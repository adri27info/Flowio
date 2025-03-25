import django_filters

from django_filters.rest_framework import DjangoFilterBackend

from apps.structures.models import Structure
from apps.structures.serializers import StructureSerializer

from utils.viewsets import BaseViewSet


class StructureFilter(django_filters.FilterSet):
    category_id = django_filters.NumberFilter(
        field_name="category_id", lookup_expr="exact"
    )

    class Meta:
        model = Structure
        fields = ["category_id"]


class StructureViewSet(BaseViewSet):
    serializer_class = StructureSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = StructureFilter

    def get_queryset(self):
        return Structure.objects.all()
