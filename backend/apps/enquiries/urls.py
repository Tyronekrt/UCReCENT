from django.urls import path

from .views import ContactMessageCreateView, SupportRequestCreateView

urlpatterns = [
    path("support/", SupportRequestCreateView.as_view(), name="support-request"),
    path("contact/", ContactMessageCreateView.as_view(), name="contact-message"),
]
