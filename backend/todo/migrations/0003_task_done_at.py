# Generated by Django 2.1.5 on 2019-01-18 01:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_task_done_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='done_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
