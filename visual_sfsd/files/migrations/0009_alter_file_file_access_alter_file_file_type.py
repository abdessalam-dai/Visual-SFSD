# Generated by Django 4.0.3 on 2022-04-20 16:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0008_file_file_access'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='file_access',
            field=models.CharField(choices=[('sequential', 'sequential'), ('indexed', 'indexed'), ('hashing', 'hashing')], default='sequential', max_length=30),
        ),
        migrations.AlterField(
            model_name='file',
            name='file_type',
            field=models.CharField(choices=[('TOF', 'TOF'), ('TnOF', 'TnOF'), ('LOF', 'LOF'), ('LnOF', 'LnOF'), ('Clustered', 'Clustered'), ('Not Clustered', 'Not Clustered')], default='TOF', max_length=30),
        ),
    ]
