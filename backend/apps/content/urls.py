from django.urls import path

from .views import (
    ApiRootView,
    GalleryImageListView,
    ImpactStatisticListView,
    PartnerListView,
    ProjectUpdateDetailView,
    ProjectUpdateListView,
    ProjectView,
)

urlpatterns = [
    path("", ApiRootView.as_view(), name="api-root"),
    path("project/", ProjectView.as_view(), name="project"),
    path("partners/", PartnerListView.as_view(), name="partner-list"),
    path("updates/", ProjectUpdateListView.as_view(), name="update-list"),
    path("updates/<slug:slug>/", ProjectUpdateDetailView.as_view(), name="update-detail"),
    path("gallery/", GalleryImageListView.as_view(), name="gallery-list"),
    path("impact/", ImpactStatisticListView.as_view(), name="impact-list"),
]
