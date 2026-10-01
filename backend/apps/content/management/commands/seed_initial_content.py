"""Seed initial CMS content from the verified project source of truth.

Idempotent: safe to run multiple times (uses update_or_create / get_or_create).
Mirrors frontend/lib/site.ts so the API and the static fallback never disagree.

Usage:
    python manage.py seed_initial_content
"""

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.content.models import ImpactStatistic, Partner, Project, ProjectUpdate

PROJECT = {
    "name": "Usao Community Library",
    "tagline": "Read · Learn · Grow · Succeed",
    "description": (
        "A community-owned library initiative in Usao Sublocation, Mbita East Division, "
        "Mbita Constituency, Homa Bay County, Kenya, led by local alumni under "
        "Dr. Benard Oloo, PhD."
    ),
    "vision": (
        "A community in Usao where every learner has access to books, a safe place to study, "
        "and the opportunity to read, learn, grow and succeed."
    ),
    "mission": (
        "To establish and sustain a community-owned library that expands access to books and "
        "study space, strengthens literacy and academic performance, and builds a lasting "
        "culture of reading and lifelong learning in Usao and surrounding communities."
    ),
    "goal": (
        "To establish a thriving community library that improves literacy, strengthens academic "
        "performance, and expands lifelong learning opportunities for the people of Usao and "
        "surrounding communities."
    ),
    "launch_date": "2026-10-07",
    "phase1_target": 500000,
    "longterm_target": 4300000,
}

IMPACT_STATS = [
    {"label": "Book capacity", "value": "10,000", "description": "Shelving planned in Phase 1", "order": 1},
    {"label": "Reading & study seats", "value": "~100", "description": "Phase 1 seating", "order": 2},
    {"label": "Phase 1 target", "value": "KES 500,000", "description": "Budget ceiling", "order": 3},
    {"label": "Planned launch", "value": "7 Oct 2026", "description": "Subject to readiness", "order": 4},
]

PARTNERS = [
    # (name, category, description, status)
    ("Egerton University Library", "Academic / professional",
     "Training and internship support for the librarian; collection-management guidance.", "strategic"),
    ("The Reading Culture", "Literacy / books",
     "Identified as providing the first 1,000 books to seed the collection (terms to be confirmed).", "strategic"),
    ("Kenya National Library Service (KNLS) — National and Nakuru", "Public library",
     "Technical guidance on standards, cataloguing, collection organization and user services.", "strategic"),
    ("Kenyan Diaspora in Ireland", "Diaspora",
     "Resource mobilization, book drives, introductions and visibility.", "strategic"),
    ("Book Aid International", "Books / publishing",
     "Being approached for suitable book donations, collection guidance and in-country distribution advice.", "being-engaged"),
    ("East African Educational Publishers", "Books / publishing",
     "Being approached for donated or discounted educational, children's and East African literary titles.", "being-engaged"),
    ("Macmillan Library / Moran Publishers", "Books / publishing",
     "Being approached for educational, reference and children's titles.", "being-engaged"),
    ("National Literacy Trust", "Literacy",
     "Being approached for literacy-programme guidance.", "being-engaged"),
    ("BookTrust", "Literacy",
     "Being approached for children's reading guidance.", "being-engaged"),
    ("The Reading Agency", "Literacy",
     "Being approached for community reading-programme guidance.", "being-engaged"),
    ("Education Endowment Foundation (EEF)", "Education / research",
     "Being approached for evidence and monitoring guidance only (no funding assumed).", "being-engaged"),
    ("Libraries Connected", "Library professional",
     "Being approached for community-library knowledge exchange.", "being-engaged"),
    ("Learn with a Librarian", "Library / learning",
     "Being approached for practical librarian resources.", "being-engaged"),
    ("CILIP — the library and information association", "Library professional",
     "Being approached for professional knowledge exchange.", "being-engaged"),
    ("Kenya Library Association (KLA)", "Library professional",
     "Being approached for mentorship and technical guidance.", "being-engaged"),
    ("Kenya National Chamber of Commerce and Industry", "Business network",
     "Being approached for business-community and CSR introductions.", "being-engaged"),
    ("Homa Bay County Government", "County government",
     "County-level coordination being explored; no endorsement or funding presumed.", "being-engaged"),
]

UPDATES = [
    {
        "slug": "concept-note-finalised",
        "title": "Concept Note finalised and partnership outreach begins",
        "category": "Planning",
        "cover_image": "/images/design-views.jpg",
        "cover_alt": "Architectural rendering — different views of the proposed Usao Community Library building",
        "excerpt": "The Usao Community Library Concept Note was finalised, setting Phase 1 at KES 500,000 on community-donated land, with tailored partnership letters prepared.",
        "content": "The Usao Community Library Initiative Team finalised the project Concept Note in August 2026.\n\nThe Concept Note confirms the Phase 1 plan — a mabati-and-wood structure with shelving for up to 10,000 books and seating for 100 users — and a target cost ceiling of KES 500,000.\n\nTailored partnership and collaboration letters were prepared for book publishers, literacy organisations, library professional bodies, diaspora networks and county stakeholders. Each recipient is approached for a contribution matching its strengths; no partnership is presented as confirmed until terms are agreed.",
        "published": True,
        "published_date": "2026-08-19T09:00:00+03:00",
    },
    {
        "slug": "phase-one-plan",
        "title": "Phase 1 plan: a lean library the community can open quickly",
        "category": "Phase 1",
        "cover_image": "/images/design-front-view.jpg",
        "cover_alt": "Architectural rendering — front view of the proposed Usao Community Library",
        "excerpt": "Phase 1 focuses on functionality and early access: community-donated land, an affordable structure, shelving for 10,000 books and seating for 100 users.",
        "content": "Phase 1 is deliberately lean so the community can begin using the library as soon as possible.\n\nThe community donates the land. Construction uses mabati-and-wood options commonly used in rural Kenya, with basic security, ventilation and lighting.\n\nThe first 1,000 books identified in the Concept Note (via The Reading Culture, terms to be confirmed) will seed the collection, which is planned to grow toward 10,000 books.",
        "published": True,
        "published_date": "2026-08-15T09:00:00+03:00",
    },
    {
        "slug": "launch-date-announced",
        "title": "Planned official launch: 7 October 2026",
        "category": "Launch",
        "cover_image": "/images/design-interior.jpg",
        "cover_alt": "Architectural rendering — interior reading and seating area of the proposed library",
        "excerpt": "The official launch is planned for 7 October 2026, followed by reading clubs, weekend study sessions and holiday reading programmes.",
        "content": "The Concept Note sets the official launch for 7 October 2026, subject to implementation readiness.\n\nAfter launch, the library plans to activate reading clubs, weekend study sessions and holiday reading programmes for children, youth and adults.\n\nThe project committee will track construction milestones, books catalogued and circulated, membership, attendance and programme participation.",
        "published": True,
        "published_date": "2026-08-10T09:00:00+03:00",
    },
]


class Command(BaseCommand):
    help = "Seed initial CMS content (idempotent)."

    def handle(self, *args, **options):
        project, created = Project.objects.update_or_create(
            name=PROJECT["name"], defaults={**PROJECT, "is_active": True}
        )
        # Deactivate any other project rows so the public endpoint is unambiguous.
        Project.objects.exclude(pk=project.pk).update(is_active=False)
        self.stdout.write(f"Project: {project} ({'created' if created else 'updated'})")

        for i, stat in enumerate(IMPACT_STATS, start=1):
            obj, _ = ImpactStatistic.objects.update_or_create(
                label=stat["label"],
                defaults={"value": stat["value"], "description": stat["description"], "order": i, "is_active": True},
            )
            self.stdout.write(f"Impact stat: {obj}")

        for i, (name, category, description, status) in enumerate(PARTNERS, start=1):
            obj, created = Partner.objects.update_or_create(
                name=name,
                defaults={"category": category, "description": description, "status": status, "order": i, "is_active": True},
            )
            self.stdout.write(f"Partner: {obj} ({'created' if created else 'updated'})")

        for data in UPDATES:
            published_date = timezone.datetime.fromisoformat(data["published_date"])
            obj, created = ProjectUpdate.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "title": data["title"],
                    "category": data["category"],
                    "cover_image": data["cover_image"],
                    "cover_alt": data["cover_alt"],
                    "excerpt": data["excerpt"],
                    "content": data["content"],
                    "published": data["published"],
                    "published_date": published_date,
                },
            )
            self.stdout.write(f"Update: {obj} ({'created' if created else 'updated'})")

        self.stdout.write(self.style.SUCCESS("Seeding complete."))
