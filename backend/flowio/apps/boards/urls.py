from rest_framework.routers import DefaultRouter

from apps.boards.views import BoardViewSet

router = DefaultRouter()
router.register(r"", BoardViewSet, basename="boards")

urlpatterns = router.urls
