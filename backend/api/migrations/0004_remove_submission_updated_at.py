# Generated by Django 5.1.5 on 2025-02-07 06:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_cycle_current'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='submission',
            name='updated_at',
        ),
    ]
