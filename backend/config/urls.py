from django.contrib import admin
from django.urls import include, path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health(_request):
    return Response({"status": "ok", "service": "usao-library-api", "version": "1.0.0"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    # Canonical V1 API
    path("api/", include("apps.content.urls")),
    path("api/", include("apps.enquiries.urls")),
    # Legacy V1 namespaces (deprecated, still served)
    path("api/", include("config.legacy_urls")),
]
