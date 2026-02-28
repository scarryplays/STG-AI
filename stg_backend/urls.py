from django.contrib import admin
# from .views import calculate_trust
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/trust/", include("trust.urls")),
]