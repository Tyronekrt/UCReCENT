from django.contrib import admin
from django.utils.html import format_html

from .models import GalleryImage, ImpactStatistic, Partner, Project, ProjectUpdate


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "launch_date", "phase1_target", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "tagline")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Identity", {"fields": ("name", "tagline", "description")}),
        ("Vision & mission", {"fields": ("vision", "mission", "goal")}),
        (
            "Location",
            {
                "fields": (
                    "location_sublocation",
                    "location_division",
                    "location_constituency",
                    "location_county",
                    "location_country",
                )
            },
        ),
        (
            "Targets",
            {
                "description": "Launch date is always presented publicly as planned, never as completed.",
                "fields": ("launch_date", "phase1_target", "longterm_target"),
            },
        ),
        ("Status", {"fields": ("is_active", "created_at", "updated_at")}),
    )


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "category", "order", "is_active", "updated_at")
    list_filter = ("status", "category", "is_active")
    search_fields = ("name", "description", "status_note")
    ordering = ("order", "name")
    readonly_fields = ("created_at", "updated_at", "logo_preview")
    fieldsets = (
        ("Partner", {"fields": ("name", "category", "description")}),
        (
            "Verification status",
            {
                "description": (
                    "Confirmed = written agreement on file. Strategic = named collaborator, "
                    "terms being confirmed. Being engaged = outreach prepared, not confirmed. "
                    "Never mark a partner confirmed without evidence."
                ),
                "fields": ("status", "status_note"),
            },
        ),
        (
            "Media & links",
            {
                "description": "Use only supplied or officially approved logos, and only verified website URLs.",
                "fields": ("logo", "logo_preview", "website"),
            },
        ),
        ("Display", {"fields": ("order", "is_active", "created_at", "updated_at")}),
    )

    @admin.display(description="Logo preview")
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="max-height:80px" alt="" />', obj.logo.url)
        return "—"


@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "author", "published", "published_date", "updated_at")
    list_filter = ("published", "category")
    search_fields = ("title", "excerpt", "content")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_date"
    ordering = ("-published_date", "-created_at")
    readonly_fields = ("created_at", "updated_at", "cover_preview")
    actions = ("publish", "unpublish")
    fieldsets = (
        ("Content", {"fields": ("title", "slug", "category", "author", "excerpt", "content")}),
        (
            "Cover image",
            {
                "description": "Uploaded cover is preferred; otherwise a static fallback path.",
                "fields": ("cover", "cover_preview", "cover_image", "cover_alt"),
            },
        ),
        ("Publication", {"fields": ("published", "published_date", "created_at", "updated_at")}),
    )

    @admin.action(description="Publish selected updates")
    def publish(self, request, queryset):
        queryset.update(published=True)

    @admin.action(description="Unpublish selected updates")
    def unpublish(self, request, queryset):
        queryset.update(published=False)

    @admin.display(description="Cover preview")
    def cover_preview(self, obj):
        if obj.cover:
            return format_html('<img src="{}" style="max-height:120px" alt="" />', obj.cover.url)
        return obj.cover_image or "—"


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("thumbnail", "caption", "category", "order", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("title", "caption", "alt_text")
    ordering = ("order", "id")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Image", {"fields": ("title", "image", "image_path", "caption", "alt_text", "category")}),
        ("Display", {"fields": ("order", "is_active", "created_at", "updated_at")}),
    )

    @admin.display(description="Preview")
    def thumbnail(self, obj):
        url = obj.image.url if obj.image else obj.image_path
        if url:
            return format_html('<img src="{}" style="max-height:60px" alt="" />', url)
        return "—"


@admin.register(ImpactStatistic)
class ImpactStatisticAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "order", "is_active", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("label", "value", "description")
    ordering = ("order", "id")
    list_editable = ("order", "is_active")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Statistic", {"fields": ("label", "value", "description")}),
        ("Display", {"fields": ("order", "is_active", "created_at", "updated_at")}),
    )
