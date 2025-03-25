from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.db.models import Max

from apps.cards.models import Card
from apps.lists.models import List
from apps.traces.serializers import TraceSerializer


class CardSerializer(serializers.ModelSerializer):
    traces = TraceSerializer(source="get_traces_card", many=True, read_only=True)

    class Meta:
        model = Card
        fields = "__all__"


class CardCreateSerializer(serializers.ModelSerializer):
    list_id = serializers.PrimaryKeyRelatedField(
        queryset=List.objects.all(),
    )
    description = serializers.CharField(
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Card
        fields = ["id", "list_id", "title", "description"]

    def validate_description(self, value):
        if value is None:
            raise ValidationError("You must fill the description")
        return value

    def create(self, validated_data):
        list_id = validated_data["list_id"]

        cards_in_list = Card.objects.filter(list_id=list_id)

        if cards_in_list.exists():
            max_order = cards_in_list.aggregate(Max("order"))["order__max"]
            new_order = max_order + 1 if max_order is not None else 1
        else:
            new_order = 1

        card = Card.objects.create(order=new_order, **validated_data)
        return card


class CardUpdateSerializer(serializers.ModelSerializer):
    list_id = serializers.PrimaryKeyRelatedField(
        queryset=List.objects.all(),
    )
    description = serializers.CharField(
        required=False,
        allow_null=True,
    )
    order = serializers.IntegerField(required=False)
    completed = serializers.BooleanField(required=False)

    class Meta:
        model = Card
        fields = [
            "id",
            "list_id",
            "title",
            "description",
            "order",
            "completed",
        ]

    def validate_description(self, value):
        if value is None:
            raise ValidationError("You must fill the description")
        return value

    def update(self, instance, validated_data):
        if "completed" in validated_data:
            validated_data["completed"] = instance.completed

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class CardPathSerializer(serializers.ModelSerializer):
    list_id = serializers.PrimaryKeyRelatedField(
        queryset=List.objects.all(),
    )
    description = serializers.CharField(
        required=False,
        allow_null=True,
    )
    order = serializers.IntegerField(required=False)
    completed = serializers.BooleanField(required=False)

    class Meta:
        model = Card
        fields = [
            "id",
            "list_id",
            "title",
            "description",
            "order",
            "completed",
        ]

    def validate_description(self, value):
        if value is None:
            raise ValidationError("You must fill the description")
        return value


class CardBatchUpdateSerializer(serializers.Serializer):
    card_id = serializers.IntegerField()
    list_id = serializers.PrimaryKeyRelatedField(
        queryset=List.objects.all(), required=False
    )
    order = serializers.IntegerField(required=False)

    class Meta:
        model = Card
        fields = [
            "card_id",
            "list_id",
            "order",
        ]

    def validate_card_id(self, value):
        if not Card.objects.filter(id=value).exists():
            raise serializers.ValidationError("Card does not exist")
        return value

    def valida_order(self, value):
        if value < 1:
            raise serializers.ValidationError("Order must be greater than 0")
        return value
