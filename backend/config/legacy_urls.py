"""Legacy V1 URL namespaces, kept working for already-deployed frontends.

Canonical endpoints now live at /api/project/, /api/partners/, /api/updates/,
/api/gallery/, /api/impact/, /api/support/ and /api/contact/.
Legacy paths are routed directly to the same views (no redirect, so POST bodies
are preserved for old clients).
"""

from django.urls import path

from apps.content.views import (
    GalleryListView,
    PartnerListView,
    UpdateDetailView,
    UpdateListView,
)
from apps.enquiries.views import ContactMessageCreateView, SupportEnquiryCreateView

urlpatterns = [
    path("enquiries/support/", SupportEnquiryCreateView.as_view()),
    path("enquiries/contact/", ContactMessageCreateView.as_view()),
    path("content/updates/", UpdateListView.as_view()),
    path("content/updates/<slug:slug>/", UpdateDetailView.as_view()),
    path("content/partners/", PartnerListView.as_view()),
    path("content/gallery/", GalleryListView.as_view()),
]
