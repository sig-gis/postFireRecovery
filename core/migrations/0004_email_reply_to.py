# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2019-01-11 09:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20190111_1215'),
    ]

    operations = [
        migrations.AddField(
            model_name='email',
            name='reply_to',
            field=models.EmailField(default='biplov@adpc.net', max_length=254),
            preserve_default=False,
        ),
    ]
