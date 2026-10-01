from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SupportEnquiry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=40)),
                ("organization", models.CharField(blank=True, max_length=200)),
                ("support_type", models.CharField(choices=[("Financial contribution", "Financial contribution"), ("Books", "Books"), ("Building materials", "Building materials"), ("ICT", "ICT"), ("Solar", "Solar"), ("Internet / connectivity", "Internet / connectivity"), ("Professional skills", "Professional skills"), ("Volunteering", "Volunteering"), ("Other", "Other")], max_length=40)),
                ("amount", models.CharField(blank=True, help_text="Optional pledged amount in KES (free text, validated on the frontend).", max_length=40)),
                ("message", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("handled", models.BooleanField(default=False)),
            ],
            options={"ordering": ["-created_at"], "verbose_name_plural": "Support enquiries"},
        ),
        migrations.CreateModel(
            name="ContactMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("email", models.EmailField(max_length=254)),
                ("subject", models.CharField(max_length=200)),
                ("message", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("handled", models.BooleanField(default=False)),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
