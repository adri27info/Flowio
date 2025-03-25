from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiResponse

from apps.cards.models import Card
from apps.cards.serializers import (
    CardSerializer,
    CardCreateSerializer,
    CardUpdateSerializer,
    CardPathSerializer,
    CardBatchUpdateSerializer,
)

from utils.viewsets import BaseViewSet


class CardViewSet(BaseViewSet):
    def get_queryset(self):
        return Card.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return CardCreateSerializer
        elif self.action == "update":
            return CardUpdateSerializer
        elif self.action == "partial_update":
            return CardPathSerializer
        return CardSerializer

    @extend_schema(
        request=CardBatchUpdateSerializer,
        responses={
            200: OpenApiResponse(
                response=CardSerializer,
            )
        },
    )
    @action(detail=False, methods=["post"], url_path="batch-update")
    def batch_update(self, request):
        updates = request.data.get("updates", [])

        if updates:
            serializer = CardBatchUpdateSerializer(data=updates, many=True)
            serializer.is_valid(raise_exception=True)

            updated_cards = []

            for update in serializer.validated_data:
                card_id = update["card_id"]
                list_id = update.get("list_id", None)
                order = update.get("order", None)

                card = Card.objects.filter(id=card_id).first()

                if list_id:
                    card.list_id = list_id
                if order:
                    card.order = order

                card.save()
                updated_cards.append(CardSerializer(card).data)

            return Response({"data": updated_cards}, status=status.HTTP_200_OK)

        return Response(
            {"error": "No updates provided"}, status=status.HTTP_400_BAD_REQUEST
        )
