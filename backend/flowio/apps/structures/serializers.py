from rest_framework import serializers

from apps.structures.models import Structure
from apps.categories.serializers import CategorySerializer


class StructureSerializer(serializers.ModelSerializer):
    category = CategorySerializer(source="category_id")

    class Meta:
        model = Structure
        fields = ["id", "title", "description", "path", "category"]
