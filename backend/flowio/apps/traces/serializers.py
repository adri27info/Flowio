from rest_framework import serializers

from apps.traces.models import Trace
from apps.cards.models import Card
from apps.users.models import User
from apps.users.serializers import UserSerializer


class TraceSerializer(serializers.ModelSerializer):
    user = UserSerializer(source="user_id", read_only=True)

    class Meta:
        model = Trace
        exclude = ["user_id"]


class TraceCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
    )
    card_id = serializers.PrimaryKeyRelatedField(
        queryset=Card.objects.all(),
    )
    description = serializers.CharField()

    class Meta:
        model = Trace
        fields = ["id", "user_id", "card_id", "description"]


class TraceUpdateSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
    )
    card_id = serializers.PrimaryKeyRelatedField(
        queryset=Card.objects.all(),
    )
    description = serializers.CharField()

    class Meta:
        model = Trace
        fields = ["user_id", "card_id", "description"]
