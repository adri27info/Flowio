from django.utils import timezone

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from apps.users.models import BlacklistedToken
from apps.users.serializers import BlacklistTokenSerializer
from apps.users.permissions import IsOwnRefreshToken


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]


class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")

        if BlacklistedToken.objects.filter(refresh_token=refresh_token).exists():
            return Response(
                {"detail": "This refresh token has been blacklisted."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return super().post(request, *args, **kwargs)


class BlacklistTokenView(GenericAPIView):
    permission_classes = [
        IsAuthenticated,
        IsOwnRefreshToken,
    ]
    serializer_class = BlacklistTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        refresh_token = serializer.validated_data["refresh_token"]

        try:
            if BlacklistedToken.objects.filter(refresh_token=refresh_token).exists():
                return Response(
                    {"detail": "This refresh token has already been blacklisted."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            BlacklistedToken.objects.create(
                user_id=request.user,
                refresh_token=refresh_token,
                created_at=timezone.now(),
            )
            return Response(
                {"detail": "Token has been blacklisted."}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
