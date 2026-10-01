"""Shared upload validators: safe file uploads with type + size restrictions."""

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]
MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5 MB

image_extension_validator = FileExtensionValidator(
    allowed_extensions=ALLOWED_IMAGE_EXTENSIONS,
    message="Only JPG, PNG or WebP images are accepted.",
)


def validate_image_size(value) -> None:
    size = getattr(value, "size", None)
    if size is not None and size > MAX_IMAGE_BYTES:
        raise ValidationError("Image must be 5 MB or smaller.")
