import django.utils.timezone
from django.db import migrations, models


def migrate_request_statuses(apps, schema_editor):
    SupportRequest = apps.get_model("enquiries", "SupportRequest")
    SupportRequest.objects.filter(handled=True).update(status="completed")
    SupportRequest.objects.filter(handled=False).update(status="new")


def migrate_message_statuses(apps, schema_editor):
    ContactMessage = apps.get_model("enquiries", "ContactMessage")
    ContactMessage.objects.filter(handled=True).update(status="completed")
    ContactMessage.objects.filter(handled=False).update(status="new")


STATUS_FIELD = {
    "choices": [
        ("new", "New"),
        ("contacted", "Contacted"),
        ("in_progress", "In progress"),
        ("completed", "Completed"),
        ("closed", "Closed"),
    ],
    "db_index": True,
    "default": "new",
    "max_length": 20,
}


class Migration(migrations.Migration):
    dependencies = [("enquiries", "0001_initial")]

    operations = [
        # Preserve existing rows: rename instead of delete + create.
        migrations.RenameModel(old_name="SupportEnquiry", new_name="SupportRequest"),
        migrations.AlterModelOptions(
            name="supportrequest",
            options={"ordering": ["-created_at"], "verbose_name": "Support request"},
        ),
        migrations.AlterField(
            model_name="supportrequest",
            name="support_type",
            field=models.CharField(
                choices=[("Financial contribution", "Financial contribution"), ("Books", "Books"), ("Building materials", "Building materials"), ("ICT", "ICT"), ("Solar", "Solar"), ("Internet / connectivity", "Internet / connectivity"), ("Professional skills", "Professional skills"), ("Volunteering", "Volunteering"), ("Other", "Other")],
                db_index=True,
                max_length=40,
            ),
        ),
        migrations.AddField(
            model_name="supportrequest",
            name="status",
            field=models.CharField(**STATUS_FIELD),
        ),
        migrations.AddField(
            model_name="supportrequest",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.RunPython(migrate_request_statuses, migrations.RunPython.noop),
        migrations.RemoveField(model_name="supportrequest", name="handled"),
        # ContactMessage evolution
        migrations.AddField(
            model_name="contactmessage",
            name="phone",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AddField(
            model_name="contactmessage",
            name="status",
            field=models.CharField(**STATUS_FIELD),
        ),
        migrations.AddField(
            model_name="contactmessage",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.RunPython(migrate_message_statuses, migrations.RunPython.noop),
        migrations.RemoveField(model_name="contactmessage", name="handled"),
    ]
