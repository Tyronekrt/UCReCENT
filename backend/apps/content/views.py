from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import GalleryImage, ImpactStatistic, Partner, Project, ProjectUpdate
from .serializers import (
    AdminGalleryImageSerializer,
    AdminImpactStatisticSerializer,
    AdminPartnerSerializer,
    AdminProjectUpdateSerializer,
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


class AdminLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_active or not user.is_staff:
            return Response({"detail": "This account is not allowed to manage the site."}, status=status.HTTP_403_FORBIDDEN)
        login(request, user)
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            },
            status=status.HTTP_200_OK,
        )


class AdminMeView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "is_staff": request.user.is_staff,
                "is_superuser": request.user.is_superuser,
            }
        )


class AdminLogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({"status": "logged_out"}, status=status.HTTP_200_OK)


class AdminContentOverviewView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        project = Project.objects.filter(is_active=True).first()
        return Response(
            {
                "project": ProjectSerializer(project).data if project else None,
                "updates": AdminProjectUpdateSerializer(ProjectUpdate.objects.order_by("-published_date", "-created_at"), many=True).data,
                "partners": AdminPartnerSerializer(Partner.objects.order_by("order", "name"), many=True).data,
                "gallery": AdminGalleryImageSerializer(GalleryImage.objects.order_by("order", "id"), many=True).data,
                "impact": AdminImpactStatisticSerializer(ImpactStatistic.objects.order_by("order", "id"), many=True).data,
            }
        )


class AdminProjectUpdateListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = ProjectUpdate.objects.order_by("-published_date", "-created_at")
    serializer_class = AdminProjectUpdateSerializer


class AdminProjectUpdateDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = ProjectUpdate.objects.all()
    serializer_class = AdminProjectUpdateSerializer


class AdminPartnerListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Partner.objects.order_by("order", "name")
    serializer_class = AdminPartnerSerializer


class AdminPartnerDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = Partner.objects.all()
    serializer_class = AdminPartnerSerializer


class AdminGalleryImageListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = GalleryImage.objects.order_by("order", "id")
    serializer_class = AdminGalleryImageSerializer


class AdminGalleryImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = GalleryImage.objects.all()
    serializer_class = AdminGalleryImageSerializer


class AdminImpactStatisticListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    queryset = ImpactStatistic.objects.order_by("order", "id")
    serializer_class = AdminImpactStatisticSerializer


class AdminImpactStatisticDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = ImpactStatistic.objects.all()
    serializer_class = AdminImpactStatisticSerializer


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
