from rest_framework import serializers

from .models import ContactMessage, SupportRequest
from .support_types import SUPPORT_TYPE_VALUES

# Legacy frontend field name mapped to the current `support_type` field.
LEGACY_INTEREST_TO_SUPPORT_TYPE = {
    "Financial sponsorship": "Financial contribution",
    "Building materials": "Building materials",
    "Books and shelving": "Books",
    "Solar energy and lighting": "Solar",
    "ICT equipment and connectivity": "ICT",
    "Volunteering / skills": "Volunteering",
    "Partnership (organisation)": "Other",
    "Other": "Other",
}

# Honeypot field: real forms never send it; bots often fill every field.
HONEYPOT_FIELD = "website"


def _validate_honeypot(value: str) -> None:
    if value:
        raise serializers.ValidationError("This submission could not be accepted.")


class SupportRequestSerializer(serializers.ModelSerializer):
    # Accept the legacy `interest` key from older frontend deployments.
    interest = serializers.CharField(write_only=True, required=False, allow_blank=True)
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)
    # Not required at field level: validate() fills it from the legacy alias first.
    support_type = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = SupportRequest
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "organization",
            "support_type",
            "interest",
            "website",
            "amount",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "name": {"min_length": 2, "max_length": 200},
            "message": {"min_length": 10, "max_length": 5000},
            "amount": {"max_length": 40},
        }

    def validate_website(self, value: str) -> str:
        _validate_honeypot(value or "")
        return ""

    def validate(self, attrs):
        attrs.pop("website", None)
        if not attrs.get("support_type") and attrs.get("interest"):
            mapped = LEGACY_INTEREST_TO_SUPPORT_TYPE.get(attrs["interest"].strip())
            if mapped is None:
                raise serializers.ValidationError({"support_type": "Unknown support type."})
            attrs["support_type"] = mapped
        attrs.pop("interest", None)
        if not attrs.get("support_type"):
            raise serializers.ValidationError({"support_type": "Support type is required."})
        if attrs["support_type"] not in SUPPORT_TYPE_VALUES:
            raise serializers.ValidationError({"support_type": "Unknown support type."})
        return attrs


class AdminSupportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportRequest
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "organization",
            "support_type",
            "amount",
            "message",
            "status",
            "created_at",
            "updated_at",
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    website = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message", "website", "created_at"]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "name": {"min_length": 2, "max_length": 200},
            "subject": {"min_length": 3, "max_length": 200},
            "message": {"min_length": 10, "max_length": 5000},
        }

    def validate_website(self, value: str) -> str:
        _validate_honeypot(value or "")
        return ""

    def validate(self, attrs):
        attrs.pop("website", None)
        return attrs


class AdminContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "email", "phone", "subject", "message", "status", "created_at", "updated_at"]
