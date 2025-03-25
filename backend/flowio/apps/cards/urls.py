from rest_framework.routers import DefaultRouter

from apps.cards.views import CardViewSet

router = DefaultRouter()
router.register(r"", CardViewSet, basename="cards")

urlpatterns = router.urls
