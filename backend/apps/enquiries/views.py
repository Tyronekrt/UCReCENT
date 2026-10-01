from rest_framework import generics
from rest_framework.throttling import ScopedRateThrottle

from .models import ContactMessage, SupportRequest
from .notifications import notify_contact_message, notify_support_request
from .serializers import ContactMessageSerializer, SupportRequestSerializer


class SubmissionThrottle(ScopedRateThrottle):
    scope = "submit"


class SupportRequestCreateView(generics.CreateAPIView):
    queryset = SupportRequest.objects.all()
    serializer_class = SupportRequestSerializer
    throttle_classes = [SubmissionThrottle]
    throttle_scope = SubmissionThrottle.scope

    def perform_create(self, serializer):
        instance = serializer.save()
        notify_support_request(
            {
                "name": instance.name,
                "email": instance.email,
                "phone": instance.phone,
                "organization": instance.organization,
                "support_type": instance.support_type,
                "amount": instance.amount,
                "message": instance.message,
            }
        )


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    throttle_classes = [SubmissionThrottle]
    throttle_scope = SubmissionThrottle.scope

    def perform_create(self, serializer):
        instance = serializer.save()
        notify_contact_message(
            {
                "name": instance.name,
                "email": instance.email,
                "phone": instance.phone,
                "subject": instance.subject,
                "message": instance.message,
            }
        )


# Backwards-compatible alias for the earlier V1 frontend path.
class SupportEnquiryCreateView(SupportRequestCreateView):
    """Legacy alias."""
