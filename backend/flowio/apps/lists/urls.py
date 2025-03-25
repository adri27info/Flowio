from rest_framework.routers import DefaultRouter

from apps.lists.views import ListViewSet

router = DefaultRouter()
router.register(r"", ListViewSet, basename="lists")

urlpatterns = router.urls
