from rest_framework.routers import DefaultRouter

from apps.structures.views import StructureViewSet

router = DefaultRouter()
router.register(r"", StructureViewSet, basename="structures")

urlpatterns = router.urls
