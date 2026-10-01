from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Update",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(unique=True)),
                ("title", models.CharField(max_length=200)),
                ("date", models.DateField()),
                ("category", models.CharField(default="General", max_length=60)),
                ("cover_image", models.CharField(blank=True, help_text="Static cover image path (e.g. /images/design-views.jpg) or absolute URL.", max_length=255)),
                ("cover_alt", models.CharField(blank=True, max_length=255)),
                ("excerpt", models.TextField()),
                ("body", models.TextField(help_text="Paragraphs separated by blank lines.")),
                ("published", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-date"]},
        ),
        migrations.CreateModel(
            name="Partner",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200, unique=True)),
                ("category", models.CharField(max_length=100)),
                ("role", models.TextField()),
                ("status", models.CharField(choices=[("named-collaborator", "Named collaborator (in Concept Note, terms to confirm)"), ("being-engaged", "Being engaged (outreach prepared, not confirmed)"), ("confirmed", "Confirmed (written agreement on file)")], default="being-engaged", max_length=30)),
                ("status_note", models.TextField(blank=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="GalleryItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("image", models.ImageField(upload_to="gallery/")),
                ("alt", models.CharField(max_length=255)),
                ("caption", models.CharField(max_length=255)),
                ("category", models.CharField(default="Community", max_length=40)),
                ("order", models.PositiveIntegerField(default=0)),
            ],
            options={"ordering": ["order", "id"]},
        ),
    ]
