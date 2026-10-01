from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import GalleryImage, ImpactStatistic, Partner, Project, ProjectUpdate
from .serializers import (
    GalleryImageSerializer,
    ImpactStatisticSerializer,
    PartnerSerializer,
    ProjectSerializer,
    ProjectUpdateSerializer,
)


class ProjectView(generics.RetrieveAPIView):
    """The single active project record."""

    serializer_class = ProjectSerializer

    def get_object(self):
        return get_object_or_404(Project, is_active=True)


class PartnerListView(generics.ListAPIView):
    serializer_class = PartnerSerializer

    def get_queryset(self):
        return Partner.objects.filter(is_active=True)


class ProjectUpdateListView(generics.ListAPIView):
    serializer_class = ProjectUpdateSerializer

    def get_queryset(self):
        return ProjectUpdate.objects.filter(published=True)


class ProjectUpdateDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectUpdateSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return ProjectUpdate.objects.filter(published=True)


class GalleryImageListView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer

    def get_queryset(self):
        return GalleryImage.objects.filter(is_active=True)


class ImpactStatisticListView(generics.ListAPIView):
    serializer_class = ImpactStatisticSerializer

    def get_queryset(self):
        return ImpactStatistic.objects.filter(is_active=True)


class ApiRootView(generics.GenericAPIView):
    """Discoverable index of public endpoints."""

    permission_classes = []
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        base = request.build_absolute_uri("/").rstrip("/")
        return Response(
            {
                "project": f"{base}/api/project/",
                "partners": f"{base}/api/partners/",
                "updates": f"{base}/api/updates/",
                "gallery": f"{base}/api/gallery/",
                "impact": f"{base}/api/impact/",
                "support": f"{base}/api/support/",
                "contact": f"{base}/api/contact/",
            }
        )


# Backwards-compatible aliases for the earlier V1 frontend paths
# (/api/content/updates/ etc.). New code should use the canonical names above.
class UpdateListView(ProjectUpdateListView):
    """Legacy alias."""


class UpdateDetailView(ProjectUpdateDetailView):
    """Legacy alias."""


class GalleryListView(GalleryImageListView):
    """Legacy alias."""


__all__ = [
    "ApiRootView",
    "GalleryImageListView",
    "GalleryListView",
    "ImpactStatisticListView",
    "PartnerListView",
    "ProjectUpdateDetailView",
    "ProjectUpdateListView",
    "ProjectView",
    "UpdateDetailView",
    "UpdateListView",
]
