# Generated by Django 4.2.7 on 2024-06-11 17:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LifeTrackAPI', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='user',
        ),
    ]
