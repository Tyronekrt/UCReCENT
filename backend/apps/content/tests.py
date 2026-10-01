from django.db import IntegrityError
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APITestCase

from .models import GalleryImage, ImpactStatistic, Partner, Project, ProjectUpdate


def make_update(**kwargs):
    defaults = {
        "title": "Test update",
        "slug": "test-update",
        "excerpt": "Excerpt",
        "content": "Para one.\n\nPara two.",
        "published": True,
        "published_date": timezone.now(),
    }
    defaults.update(kwargs)
    return ProjectUpdate.objects.create(**defaults)


class ProjectModelTests(TestCase):
    def test_str_and_location_full(self):
        p = Project.objects.create(
            name="Usao Community Library",
            tagline="Read · Learn · Grow · Succeed",
            description="d",
            vision="v",
            mission="m",
            goal="g",
        )
        self.assertEqual(str(p), "Usao Community Library")
        self.assertIn("Homa Bay County", p.location_full)


class PartnerModelTests(TestCase):
    def test_default_status_is_being_engaged(self):
        p = Partner.objects.create(name="X", category="Test", description="d")
        self.assertEqual(p.status, "being-engaged")

    def test_name_unique(self):
        Partner.objects.create(name="Dup", category="Test")
        with self.assertRaises(IntegrityError):
            Partner.objects.create(name="Dup", category="Test")

    def test_ordering(self):
        Partner.objects.create(name="B", category="T", order=2)
        Partner.objects.create(name="A", category="T", order=1)
        self.assertEqual([p.name for p in Partner.objects.all()], ["A", "B"])


class ProjectUpdateModelTests(TestCase):
    def test_slug_unique(self):
        make_update(slug="same")
        with self.assertRaises(IntegrityError):
            make_update(slug="same", title="Other")

    def test_str(self):
        self.assertEqual(str(make_update()), "Test update")


class GalleryImageModelTests(TestCase):
    def test_str_prefers_title_then_caption(self):
        g = GalleryImage.objects.create(image="g/a.jpg", caption="Cap", alt_text="alt", title="Title")
        self.assertEqual(str(g), "Title")
        g.title = ""
        self.assertEqual(str(g), "Cap")


class ImpactStatisticModelTests(TestCase):
    def test_str_and_ordering(self):
        ImpactStatistic.objects.create(label="B", value="2", order=2)
        ImpactStatistic.objects.create(label="A", value="1", order=1)
        stats = list(ImpactStatistic.objects.all())
        self.assertEqual([s.label for s in stats], ["A", "B"])
        self.assertEqual(str(stats[0]), "1 — A")


class PublicApiTests(APITestCase):
    def setUp(self):
        self.published = make_update()
        make_update(slug="draft", title="Draft", published=False)
        Partner.objects.create(name="Active", category="T", status="confirmed")
        Partner.objects.create(name="Hidden", category="T", is_active=False)
        GalleryImage.objects.create(image="g/1.jpg", caption="One", alt_text="alt")
        GalleryImage.objects.create(image="g/2.jpg", caption="Two", alt_text="alt", is_active=False)
        ImpactStatistic.objects.create(label="Books", value="10,000")
        ImpactStatistic.objects.create(label="Hidden", value="0", is_active=False)
        Project.objects.create(
            name="Usao Community Library", tagline="t", description="d",
            vision="v", mission="m", goal="g",
        )

    def test_update_list_only_published(self):
        res = self.client.get("/api/updates/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["slug"], self.published.slug)

    def test_update_detail_by_slug(self):
        res = self.client.get(f"/api/updates/{self.published.slug}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["title"], "Test update")
        self.assertIn("Para one.", res.data["content_paragraphs"])

    def test_update_detail_404_for_unpublished_and_unknown(self):
        self.assertEqual(self.client.get("/api/updates/draft/").status_code, 404)
        self.assertEqual(self.client.get("/api/updates/nope/").status_code, 404)

    def test_update_list_is_read_only(self):
        self.assertEqual(self.client.post("/api/updates/", {}).status_code, 405)

    def test_partners_only_active(self):
        res = self.client.get("/api/partners/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual([p["name"] for p in res.data], ["Active"])

    def test_gallery_only_active(self):
        res = self.client.get("/api/gallery/")
        self.assertEqual([g["caption"] for g in res.data], ["One"])

    def test_impact_only_active(self):
        res = self.client.get("/api/impact/")
        self.assertEqual([s["label"] for s in res.data], ["Books"])

    def test_project_returns_active(self):
        res = self.client.get("/api/project/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["name"], "Usao Community Library")

    def test_project_404_when_none_active(self):
        Project.objects.update(is_active=False)
        self.assertEqual(self.client.get("/api/project/").status_code, 404)

    def test_public_serializers_hide_admin_fields(self):
        res = self.client.get("/api/partners/")
        self.assertNotIn("is_active", res.data[0])
        self.assertNotIn("created_at", res.data[0])


class AdminBoundaryTests(APITestCase):
    def test_admin_requires_login(self):
        res = self.client.get("/admin/", follow=False)
        # Anonymous users are redirected to the login page, never served the admin.
        self.assertEqual(res.status_code, 302)
        self.assertIn("/admin/login/", res["Location"])
