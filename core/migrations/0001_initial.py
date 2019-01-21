# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2019-01-11 05:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Email',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sent_on', models.DateTimeField(auto_now_add=True)),
                ('subject', models.CharField(max_length=78)),
                ('body', models.TextField()),
                ('from_address', models.EmailField(max_length=254)),
                ('to_address', models.EmailField(max_length=254)),
                ('inbound', models.BooleanField(default=False)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('modified_on', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': '"msg_email"',
            },
        ),
    ]