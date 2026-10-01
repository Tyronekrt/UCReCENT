from django.db import models

from .support_types import SUPPORT_TYPE_CHOICES

STATUS_NEW = "new"
STATUS_CONTACTED = "contacted"
STATUS_IN_PROGRESS = "in_progress"
STATUS_COMPLETED = "completed"
STATUS_CLOSED = "closed"
STATUS_CHOICES = [
    (STATUS_NEW, "New"),
    (STATUS_CONTACTED, "Contacted"),
    (STATUS_IN_PROGRESS, "In progress"),
    (STATUS_COMPLETED, "Completed"),
    (STATUS_CLOSED, "Closed"),
]


class SupportRequest(models.Model):
    """Interest in supporting the project (V1 enquiry flow — no payments taken)."""

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    organization = models.CharField(max_length=200, blank=True)
    support_type = models.CharField(max_length=40, choices=SUPPORT_TYPE_CHOICES, db_index=True)
    amount = models.CharField(
        max_length=40,
        blank=True,
        help_text="Optional pledged amount in KES (free text, validated on the frontend).",
    )
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Support request"
        indexes = [models.Index(fields=["status", "-created_at"])]

    def __str__(self) -> str:
        return f"{self.name} — {self.support_type} ({self.created_at:%Y-%m-%d})"


class ContactMessage(models.Model):
    """General contact-form message."""

    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["status", "-created_at"])]

    def __str__(self) -> str:
        return f"{self.name} — {self.subject} ({self.created_at:%Y-%m-%d})"
