from rest_framework import serializers

from .models import GalleryImage, ImpactStatistic, Partner, Project, ProjectUpdate


class ProjectSerializer(serializers.ModelSerializer):
    location_full = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            "name",
            "tagline",
            "description",
            "vision",
            "mission",
            "goal",
            "location_sublocation",
            "location_division",
            "location_constituency",
            "location_county",
            "location_country",
            "location_full",
            "launch_date",
            "phase1_target",
            "longterm_target",
        ]


class PartnerSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ["name", "description", "logo_url", "website", "category", "status", "status_note", "order"]

    def get_logo_url(self, obj: Partner):
        request = self.context.get("request")
        if obj.logo:
            url = obj.logo.url
            return request.build_absolute_uri(url) if request else url
        return ""


class ProjectUpdateSerializer(serializers.ModelSerializer):
    # Canonical fields
    published_date = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    cover_url = serializers.SerializerMethodField()
    content_paragraphs = serializers.SerializerMethodField()
    # Legacy aliases kept for older frontend deployments
    date = serializers.SerializerMethodField()
    coverImage = serializers.SerializerMethodField()
    coverAlt = serializers.CharField(source="cover_alt", read_only=True)
    body_paragraphs = serializers.SerializerMethodField()

    class Meta:
        model = ProjectUpdate
        fields = [
            "slug",
            "title",
            "excerpt",
            "content_paragraphs",
            "body_paragraphs",
            "cover_url",
            "coverImage",
            "cover_alt",
            "coverAlt",
            "category",
            "author",
            "published_date",
            "date",
        ]

    def _cover(self, obj: ProjectUpdate) -> str:
        if obj.cover:
            url = obj.cover.url
            request = self.context.get("request")
            return request.build_absolute_uri(url) if request else url
        return obj.cover_image or ""

    def get_cover_url(self, obj: ProjectUpdate) -> str:
        return self._cover(obj)

    def get_coverImage(self, obj: ProjectUpdate) -> str:
        return self._cover(obj)

    @staticmethod
    def _paragraphs(obj: ProjectUpdate) -> list[str]:
        return [p.strip() for p in (obj.content or "").split("\n\n") if p.strip()]

    def get_content_paragraphs(self, obj: ProjectUpdate) -> list[str]:
        return self._paragraphs(obj)

    def get_body_paragraphs(self, obj: ProjectUpdate) -> list[str]:
        return self._paragraphs(obj)

    def get_date(self, obj: ProjectUpdate) -> str:
        if obj.published_date:
            return obj.published_date.date().isoformat()
        return ""


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    alt = serializers.CharField(source="alt_text", read_only=True)

    class Meta:
        model = GalleryImage
        fields = ["title", "image_url", "image_path", "caption", "category", "alt_text", "alt", "order"]

    def get_image_url(self, obj: GalleryImage) -> str:
        if obj.image:
            url = obj.image.url
            request = self.context.get("request")
            return request.build_absolute_uri(url) if request else url
        return obj.image_path or ""


class ImpactStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactStatistic
        fields = ["label", "value", "description", "order"]
