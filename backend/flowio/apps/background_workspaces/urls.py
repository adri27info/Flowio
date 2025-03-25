from rest_framework.routers import DefaultRouter

from apps.background_workspaces.views import BackgroundWorkspaceViewSet

router = DefaultRouter()
router.register(r"", BackgroundWorkspaceViewSet, basename="background_workspaces")

urlpatterns = router.urls
