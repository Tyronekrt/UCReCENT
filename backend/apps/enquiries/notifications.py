"""Email notifications for form submissions.

Provider is fully configurable via environment variables (see .env.example).
Failures are logged, never raised to the website visitor.
"""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def _recipients() -> list[str]:
    recipients = []
    primary = getattr(settings, "NOTIFICATION_EMAIL", "")
    if primary:
        recipients.append(primary)
    recipients.extend(getattr(settings, "NOTIFICATION_EXTRA_EMAILS", []))
    return recipients


def notify_support_request(data: dict) -> None:
    recipients = _recipients()
    if not recipients:
        logger.info("Support request received but NOTIFICATION_EMAIL is not configured; skipping email.")
        return
    subject = f"[Usao Library] Support enquiry — {data.get('support_type', 'General')} — {data.get('name', '')}"
    body = (
        f"Name: {data.get('name', '')}\n"
        f"Email: {data.get('email', '')}\n"
        f"Phone: {data.get('phone', '')}\n"
        f"Organisation: {data.get('organization', '')}\n"
        f"Support type: {data.get('support_type', '')}\n"
        f"Amount: {data.get('amount', '')}\n"
        f"\n{data.get('message', '')}\n"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=False)
    except Exception:  # noqa: BLE001 — notification must never break the request
        logger.warning("Failed to send support-request notification email.", exc_info=True)


def notify_contact_message(data: dict) -> None:
    recipients = _recipients()
    if not recipients:
        logger.info("Contact message received but NOTIFICATION_EMAIL is not configured; skipping email.")
        return
    subject = f"[Usao Library] Contact — {data.get('subject', '')} — {data.get('name', '')}"
    body = (
        f"Name: {data.get('name', '')}\n"
        f"Email: {data.get('email', '')}\n"
        f"Phone: {data.get('phone', '')}\n"
        f"\n{data.get('message', '')}\n"
    )
    try:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, recipients, fail_silently=False)
    except Exception:  # noqa: BLE001
        logger.warning("Failed to send contact-message notification email.", exc_info=True)
