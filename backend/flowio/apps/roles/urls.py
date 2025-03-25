from rest_framework.routers import DefaultRouter

from apps.roles.views import RoleViewSet

router = DefaultRouter()
router.register(r"", RoleViewSet, basename="roles")

urlpatterns = router.urls
