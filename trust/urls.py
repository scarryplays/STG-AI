from django.urls import path
from .views import calculate_trust

urlpatterns = [
    path("calculate/", calculate_trust),
]