from django.db import models

from .validators import image_extension_validator, validate_image_size

IMAGE_VALIDATORS = [image_extension_validator, validate_image_size]


class Project(models.Model):
    """Core, rarely-changing project facts. Only one row should be active at a time."""

    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=200)
    description = models.TextField()
    vision = models.TextField()
    mission = models.TextField()
    goal = models.TextField()
    location_sublocation = models.CharField(max_length=120, default="Usao Sublocation")
    location_division = models.CharField(max_length=120, default="Mbita East Division")
    location_constituency = models.CharField(max_length=120, default="Mbita Constituency")
    location_county = models.CharField(max_length=120, default="Homa Bay County")
    location_country = models.CharField(max_length=120, default="Kenya")
    launch_date = models.DateField(
        null=True, blank=True, help_text="Planned official launch date (shown as planned)."
    )
    phase1_target = models.PositiveIntegerField(
        default=500000, help_text="Phase 1 fundraising target in KES."
    )
    longterm_target = models.PositiveIntegerField(
        default=4300000, help_text="Full-functionality estimate in KES."
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_active", "-updated_at"]

    def __str__(self) -> str:
        return self.name

    @property
    def location_full(self) -> str:
        return (
            f"{self.location_sublocation}, {self.location_division}, "
            f"{self.location_constituency}, {self.location_county}, {self.location_country}"
        )


class Partner(models.Model):
    """Partner record with explicit verification status (V1 trust rule)."""

    STATUS_CONFIRMED = "confirmed"
    STATUS_STRATEGIC = "strategic"
    STATUS_BEING_ENGAGED = "being-engaged"
    STATUS_CHOICES = [
        (STATUS_CONFIRMED, "Confirmed (written agreement on file)"),
        (STATUS_STRATEGIC, "Strategic (named collaborator, terms being confirmed)"),
        (STATUS_BEING_ENGAGED, "Being engaged (outreach prepared, not confirmed)"),
    ]

    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(
        blank=True, help_text="What this organisation/person contributes or is asked to contribute."
    )
    logo = models.ImageField(
        upload_to="partners/logos/",
        blank=True,
        null=True,
        validators=IMAGE_VALIDATORS,
        help_text="Use only supplied or officially approved logos.",
    )
    website = models.URLField(
        blank=True, help_text="Public website. Only verified URLs — leave blank otherwise."
    )
    category = models.CharField(max_length=100, db_index=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_BEING_ENGAGED, db_index=True)
    status_note = models.TextField(
        blank=True, help_text="Internal note on what still needs verification."
    )
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        indexes = [models.Index(fields=["is_active", "order"])]

    def __str__(self) -> str:
        return f"{self.name} [{self.get_status_display()}]"


class ProjectUpdate(models.Model):
    """Publishable news entry. Only published rows are exposed by the public API."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, help_text="Used in /updates/{slug}/ — must stay stable.")
    excerpt = models.TextField()
    content = models.TextField(help_text="Paragraphs separated by blank lines.")
    cover = models.ImageField(
        upload_to="updates/covers/",
        blank=True,
        null=True,
        validators=IMAGE_VALIDATORS,
        help_text="Uploaded cover image (preferred).",
    )
    cover_image = models.CharField(
        max_length=255,
        blank=True,
        help_text="Fallback static path (e.g. /images/design-views.jpg) when no upload exists.",
    )
    cover_alt = models.CharField(max_length=255, blank=True)
    category = models.CharField(max_length=60, default="General", db_index=True)
    author = models.CharField(max_length=200, default="Usao Community Library Initiative Team")
    published = models.BooleanField(default=False, db_index=True)
    published_date = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_date", "-created_at"]
        indexes = [models.Index(fields=["published", "-published_date"])]

    def __str__(self) -> str:
        return self.title


class GalleryImage(models.Model):
    """Gallery entry. Only active rows are exposed by the public API."""

    title = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to="gallery/", validators=IMAGE_VALIDATORS)
    image_path = models.CharField(
        max_length=255,
        blank=True,
        help_text="Fallback static path (e.g. /images/...) when migrated from the static site.",
    )
    caption = models.CharField(max_length=255)
    category = models.CharField(max_length=40, default="Community", db_index=True)
    alt_text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]
        indexes = [models.Index(fields=["is_active", "order"])]

    def __str__(self) -> str:
        return self.title or self.caption


class ImpactStatistic(models.Model):
    """Homepage/API statistic. Only active rows are exposed, in display order."""

    label = models.CharField(max_length=120)
    value = models.CharField(max_length=60, help_text="Display value, e.g. 10,000 or KES 500,000.")
    description = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]
        indexes = [models.Index(fields=["is_active", "order"])]

    def __str__(self) -> str:
        return f"{self.value} — {self.label}"
