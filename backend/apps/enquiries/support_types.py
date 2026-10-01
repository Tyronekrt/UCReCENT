"""Canonical V1 support types, mirrored from frontend types/index.ts SUPPORT_TYPES."""

SUPPORT_TYPE_CHOICES = [
    ("Financial contribution", "Financial contribution"),
    ("Books", "Books"),
    ("Building materials", "Building materials"),
    ("ICT", "ICT"),
    ("Solar", "Solar"),
    ("Internet / connectivity", "Internet / connectivity"),
    ("Professional skills", "Professional skills"),
    ("Volunteering", "Volunteering"),
    ("Other", "Other"),
]

SUPPORT_TYPE_VALUES = {choice[0] for choice in SUPPORT_TYPE_CHOICES}
