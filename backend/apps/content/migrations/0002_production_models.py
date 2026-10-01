import django.utils.timezone
from django.db import migrations, models


def migrate_partner_statuses(apps, schema_editor):
    Partner = apps.get_model("content", "Partner")
    # Old "named-collaborator" semantics match the new "strategic" status.
    Partner.objects.filter(status="named-collaborator").update(status="strategic")


def reverse_partner_statuses(apps, schema_editor):
    Partner = apps.get_model("content", "Partner")
    Partner.objects.filter(status="strategic").update(status="named-collaborator")


class Migration(migrations.Migration):
    dependencies = [("content", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("tagline", models.CharField(max_length=200)),
                ("description", models.TextField()),
                ("vision", models.TextField()),
                ("mission", models.TextField()),
                ("goal", models.TextField()),
                ("location_sublocation", models.CharField(default="Usao Sublocation", max_length=120)),
                ("location_division", models.CharField(default="Mbita East Division", max_length=120)),
                ("location_constituency", models.CharField(default="Mbita Constituency", max_length=120)),
                ("location_county", models.CharField(default="Homa Bay County", max_length=120)),
                ("location_country", models.CharField(default="Kenya", max_length=120)),
                ("launch_date", models.DateField(blank=True, help_text="Planned official launch date (shown as planned).", null=True)),
                ("phase1_target", models.PositiveIntegerField(default=500000, help_text="Phase 1 fundraising target in KES.")),
                ("longterm_target", models.PositiveIntegerField(default=4300000, help_text="Full-functionality estimate in KES.")),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-is_active", "-updated_at"]},
        ),
        migrations.CreateModel(
            name="ImpactStatistic",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(max_length=120)),
                ("value", models.CharField(help_text="Display value, e.g. 10,000 or KES 500,000.", max_length=60)),
                ("description", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveIntegerField(db_index=True, default=0)),
                ("is_active", models.BooleanField(db_index=True, default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["order", "id"]},
        ),
        # Preserve existing rows: rename instead of delete + create.
        migrations.RenameModel(old_name="Update", new_name="ProjectUpdate"),
        migrations.RenameModel(old_name="GalleryItem", new_name="GalleryImage"),
        # ProjectUpdate evolution
        migrations.RenameField(model_name="projectupdate", old_name="body", new_name="content"),
        migrations.RenameField(model_name="projectupdate", old_name="date", new_name="published_date"),
        migrations.AlterModelOptions(
            name="projectupdate",
            options={"ordering": ["-published_date", "-created_at"]},
        ),
        migrations.AlterField(
            model_name="projectupdate",
            name="published_date",
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name="projectupdate",
            name="category",
            field=models.CharField(db_index=True, default="General", max_length=60),
        ),
        migrations.AlterField(
            model_name="projectupdate",
            name="cover_image",
            field=models.CharField(blank=True, help_text="Fallback static path (e.g. /images/design-views.jpg) when no upload exists.", max_length=255),
        ),
        migrations.AlterField(
            model_name="projectupdate",
            name="published",
            field=models.BooleanField(db_index=True, default=False),
        ),
        migrations.AlterField(
            model_name="projectupdate",
            name="slug",
            field=models.SlugField(help_text="Used in /updates/{slug}/ — must stay stable.", unique=True),
        ),
        migrations.AddField(
            model_name="projectupdate",
            name="author",
            field=models.CharField(default="Usao Community Library Initiative Team", max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="projectupdate",
            name="cover",
            field=models.ImageField(blank=True, help_text="Uploaded cover image (preferred).", null=True, upload_to="updates/covers/"),
        ),
        migrations.AddField(
            model_name="projectupdate",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        # GalleryImage evolution
        migrations.RenameField(model_name="galleryimage", old_name="alt", new_name="alt_text"),
        migrations.AlterField(
            model_name="galleryimage",
            name="category",
            field=models.CharField(db_index=True, default="Community", max_length=40),
        ),
        migrations.AlterField(
            model_name="galleryimage",
            name="image",
            field=models.ImageField(upload_to="gallery/"),
        ),
        migrations.AlterField(
            model_name="galleryimage",
            name="order",
            field=models.PositiveIntegerField(db_index=True, default=0),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="title",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="image_path",
            field=models.CharField(blank=True, help_text="Fallback static path (e.g. /images/...) when migrated from the static site.", max_length=255),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="is_active",
            field=models.BooleanField(db_index=True, default=True),
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="galleryimage",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        # Partner evolution
        migrations.RenameField(model_name="partner", old_name="role", new_name="description"),
        migrations.AlterModelOptions(name="partner", options={"ordering": ["order", "name"]}),
        migrations.AlterField(
            model_name="partner",
            name="category",
            field=models.CharField(db_index=True, max_length=100),
        ),
        migrations.AlterField(
            model_name="partner",
            name="description",
            field=models.TextField(blank=True, help_text="What this organisation/person contributes or is asked to contribute."),
        ),
        migrations.AlterField(
            model_name="partner",
            name="status",
            field=models.CharField(
                choices=[
                    ("confirmed", "Confirmed (written agreement on file)"),
                    ("strategic", "Strategic (named collaborator, terms being confirmed)"),
                    ("being-engaged", "Being engaged (outreach prepared, not confirmed)"),
                ],
                db_index=True,
                default="being-engaged",
                max_length=30,
            ),
        ),
        migrations.AlterField(
            model_name="partner",
            name="status_note",
            field=models.TextField(blank=True, help_text="Internal note on what still needs verification."),
        ),
        migrations.AddField(
            model_name="partner",
            name="logo",
            field=models.ImageField(blank=True, help_text="Use only supplied or officially approved logos.", null=True, upload_to="partners/logos/"),
        ),
        migrations.AddField(
            model_name="partner",
            name="website",
            field=models.URLField(blank=True, help_text="Public website. Only verified URLs — leave blank otherwise."),
        ),
        migrations.AddField(
            model_name="partner",
            name="order",
            field=models.PositiveIntegerField(db_index=True, default=0),
        ),
        migrations.AddField(
            model_name="partner",
            name="is_active",
            field=models.BooleanField(db_index=True, default=True),
        ),
        migrations.AddField(
            model_name="partner",
            name="created_at",
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="partner",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.RunPython(migrate_partner_statuses, reverse_partner_statuses),
    ]
