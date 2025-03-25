from rest_framework import serializers

from apps.lists.models import List
from apps.boards.models import Board
from apps.cards.serializers import CardSerializer


class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(source="get_cards_list", many=True, read_only=True)

    class Meta:
        model = List
        fields = [
            "id",
            "title",
            "cards",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        cards = representation.get("cards", [])
        representation["cards"] = sorted(cards, key=lambda x: x["order"], reverse=False)

        return representation


class ListCreateSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    board_id = serializers.PrimaryKeyRelatedField(
        queryset=Board.objects.all(),
    )

    class Meta:
        model = List
        fields = [
            "id",
            "title",
            "board_id",
        ]


class ListUpdateSerializer(serializers.ModelSerializer):
    title = serializers.CharField()

    class Meta:
        model = List
        fields = ["title"]
