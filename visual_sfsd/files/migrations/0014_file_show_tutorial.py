# Generated by Django 4.0.4 on 2022-05-15 03:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0013_alter_file_file_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='show_tutorial',
            field=models.BooleanField(default=True),
        ),
    ]
