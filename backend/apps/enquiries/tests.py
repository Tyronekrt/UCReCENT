from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APITestCase

from .models import ContactMessage, SupportRequest
from .serializers import ContactMessageSerializer, SupportRequestSerializer


def support_payload(**kwargs):
    data = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+254700000000",
        "organization": "Example Org",
        "support_type": "Books",
        "amount": "",
        "message": "We would like to donate books to the library.",
    }
    data.update(kwargs)
    return data


def contact_payload(**kwargs):
    data = {
        "name": "John Doe",
        "email": "john@example.com",
        "subject": "Hello",
        "message": "I have a question about the library project.",
    }
    data.update(kwargs)
    return data


class SupportRequestSerializerTests(TestCase):
    def test_valid(self):
        s = SupportRequestSerializer(data=support_payload())
        self.assertTrue(s.is_valid(), s.errors)

    def test_support_type_required(self):
        s = SupportRequestSerializer(data=support_payload(support_type=""))
        self.assertFalse(s.is_valid())
        self.assertIn("support_type", s.errors)

    def test_unknown_support_type_rejected(self):
        s = SupportRequestSerializer(data=support_payload(support_type="Spaceships"))
        self.assertFalse(s.is_valid())

    def test_legacy_interest_mapped(self):
        s = SupportRequestSerializer(data={**support_payload(support_type=""), "interest": "Financial sponsorship"})
        self.assertTrue(s.is_valid(), s.errors)
        self.assertEqual(s.validated_data["support_type"], "Financial contribution")

    def test_legacy_interest_unknown_rejected(self):
        s = SupportRequestSerializer(data={**support_payload(support_type=""), "interest": "Nonsense"})
        self.assertFalse(s.is_valid())

    def test_honeypot_rejected(self):
        s = SupportRequestSerializer(data=support_payload(website="http://spam.example"))
        self.assertFalse(s.is_valid())

    def test_short_message_rejected(self):
        s = SupportRequestSerializer(data=support_payload(message="hi"))
        self.assertFalse(s.is_valid())

    def test_bad_email_rejected(self):
        s = SupportRequestSerializer(data=support_payload(email="not-an-email"))
        self.assertFalse(s.is_valid())


class ContactMessageSerializerTests(TestCase):
    def test_valid_with_optional_phone(self):
        s = ContactMessageSerializer(data=contact_payload(phone="+254711111111"))
        self.assertTrue(s.is_valid(), s.errors)

    def test_missing_subject_rejected(self):
        data = contact_payload()
        del data["subject"]
        s = ContactMessageSerializer(data=data)
        self.assertFalse(s.is_valid())

    def test_honeypot_rejected(self):
        s = ContactMessageSerializer(data=contact_payload(website="spam"))
        self.assertFalse(s.is_valid())


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    NOTIFICATION_EMAIL="team@example.org",
)
class SubmissionApiTests(APITestCase):
    def test_support_post_creates_new_request_and_notifies(self):
        res = self.client.post("/api/support/", support_payload(), format="json")
        self.assertEqual(res.status_code, 201, res.data)
        obj = SupportRequest.objects.get()
        self.assertEqual(obj.status, "new")
        self.assertEqual(obj.support_type, "Books")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Support enquiry", mail.outbox[0].subject)

    def test_support_post_invalid_data_rejected_safely(self):
        res = self.client.post("/api/support/", support_payload(email="bad"), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(SupportRequest.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_support_post_honeypot_rejected(self):
        res = self.client.post("/api/support/", support_payload(website="spam"), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(SupportRequest.objects.count(), 0)

    def test_support_endpoint_is_post_only(self):
        self.assertEqual(self.client.get("/api/support/").status_code, 405)

    def test_contact_post_creates_and_notifies(self):
        res = self.client.post("/api/contact/", contact_payload(), format="json")
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(ContactMessage.objects.get().status, "new")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Contact", mail.outbox[0].subject)

    def test_contact_post_invalid_rejected(self):
        res = self.client.post("/api/contact/", contact_payload(message="short"), format="json")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_contact_endpoint_is_post_only(self):
        self.assertEqual(self.client.get("/api/contact/").status_code, 405)

    def test_submission_throttle_scope_configured(self):
        from .views import ContactMessageCreateView, SupportRequestCreateView

        for view in (SupportRequestCreateView, ContactMessageCreateView):
            self.assertEqual(view.throttle_scope, "submit")

    def test_submission_rate_limit_enforced(self):
        # Project rate is 10/minute for the shared "submit" scope. Use a unique
        # client IP so this test has an isolated throttle bucket.
        codes = [
            self.client.post("/api/contact/", contact_payload(), format="json", REMOTE_ADDR="10.99.0.1").status_code
            for _ in range(11)
        ]
        self.assertEqual(codes[:10], [201] * 10)
        self.assertEqual(codes[10], 429)

    def test_legacy_paths_still_served(self):
        res = self.client.post("/api/enquiries/support/", support_payload(), format="json")
        self.assertEqual(res.status_code, 201, res.data)
        res = self.client.post("/api/enquiries/contact/", contact_payload(), format="json")
        self.assertEqual(res.status_code, 201, res.data)
