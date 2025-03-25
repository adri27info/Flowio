from rest_framework.routers import DefaultRouter

from apps.workspaces.views import WorkspaceViewSet

router = DefaultRouter()
router.register(r"", WorkspaceViewSet, basename="workspaces")

urlpatterns = router.urls
