from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import RefreshToken


class IsOwnRefreshToken(BasePermission):
    """
    Custom permission to verify that the refresh_token belongs
    to the authenticated user.
    """

    def has_permission(self, request, view):
        refresh_token = request.data.get("refresh_token")

        if not refresh_token:
            return False

        try:
            token = RefreshToken(refresh_token)
            if token.payload.get("user_id") == request.user.id:
                return True
            return False
        except Exception:
            return False
