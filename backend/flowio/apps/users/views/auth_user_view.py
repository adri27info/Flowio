from rest_framework import status
from rest_framework.mixins import CreateModelMixin
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.serializers import (
    LoginSerializer,
    RegisterSerializer,
    ResendActivationCodeSerializer,
    ActivateAccountSerializer,
)


class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response(
            {
                "message": "Login successful.",
                "role_id": user.role_id.id,
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
            status=status.HTTP_200_OK,
        )


class RegisterUserView(CreateModelMixin, GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        return Response(
            {
                "message": "User registered successfully. Please enter the activation code sent to your email.",
                "data": response.data,
            },
            status=status.HTTP_201_CREATED,
        )


class ResendActivationCodeView(GenericAPIView):
    serializer_class = ResendActivationCodeSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {"detail": "Activation code has been sent. Check your email."},
            status=status.HTTP_200_OK,
        )


class ActivateAccountView(GenericAPIView):
    serializer_class = ActivateAccountSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {"detail": "User account successfully activated."},
            status=status.HTTP_200_OK,
        )
