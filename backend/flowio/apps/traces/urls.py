from rest_framework.routers import DefaultRouter

from apps.traces.views import TraceViewSet

router = DefaultRouter()
router.register(r"", TraceViewSet, basename="traces")

urlpatterns = router.urls
