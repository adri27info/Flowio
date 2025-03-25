from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from django.contrib import admin
from django.urls import path, include

from apps.users.views.auth_token_view import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    BlacklistTokenView,
)
from apps.users.views.auth_user_view import (
    LoginUserView,
    RegisterUserView,
    ResendActivationCodeView,
    ActivateAccountView,
)

urlpatterns = [
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("api/blacklist-token/", BlacklistTokenView.as_view(), name="blacklist-token"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"
    ),
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", LoginUserView.as_view(), name="login"),
    path("resend-code/", ResendActivationCodeView.as_view(), name="resend-code"),
    path("activation-code/", ActivateAccountView.as_view(), name="activation-code"),
    path("admin/", admin.site.urls),
    path("background_workspaces/", include("apps.background_workspaces.urls")),
    path("boards/", include("apps.boards.urls")),
    path("cards/", include("apps.cards.urls")),
    path("categories/", include("apps.categories.urls")),
    path("lists/", include("apps.lists.urls")),
    path("roles/", include("apps.roles.urls")),
    path("structures/", include("apps.structures.urls")),
    path("traces/", include("apps.traces.urls")),
    path("users/", include("apps.users.urls")),
    path("workspaces/", include("apps.workspaces.urls")),
]
