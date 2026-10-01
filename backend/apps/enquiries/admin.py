from django.contrib import admin

from .models import ContactMessage, SupportRequest


def _status_action(value, label):
    @admin.action(description=label)
    def action(modeladmin, request, queryset):
        queryset.update(status=value)

    action.__name__ = f"mark_{value}"
    return action


class SubmissionAdminMixin:
    readonly_fields = ("created_at", "updated_at")
    actions = (
        _status_action("contacted", "Mark as contacted"),
        _status_action("in_progress", "Mark as in progress"),
        _status_action("completed", "Mark as completed"),
        _status_action("closed", "Mark as closed"),
    )


@admin.register(SupportRequest)
class SupportRequestAdmin(SubmissionAdminMixin, admin.ModelAdmin):
    list_display = ("name", "support_type", "organization", "status", "created_at")
    list_filter = ("status", "support_type")
    search_fields = ("name", "email", "organization", "message")
    ordering = ("-created_at",)
    readonly_fields = ("name", "email", "phone", "organization", "support_type", "amount", "message", "created_at", "updated_at")
    fieldsets = (
        ("Request", {"fields": ("name", "email", "phone", "organization")}),
        ("Support", {"fields": ("support_type", "amount", "message")}),
        ("Workflow", {"fields": ("status", "created_at", "updated_at")}),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(SubmissionAdminMixin, admin.ModelAdmin):
    list_display = ("name", "subject", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "email", "subject", "message")
    ordering = ("-created_at",)
    readonly_fields = ("name", "email", "phone", "subject", "message", "created_at", "updated_at")
    fieldsets = (
        ("Message", {"fields": ("name", "email", "phone", "subject", "message")}),
        ("Workflow", {"fields": ("status", "created_at", "updated_at")}),
    )
