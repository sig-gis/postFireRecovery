# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from core.models import ContactUs, Email

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ('id', 'name', 'email_id')


class EmailSerializer(serializers.Serializer):
    class Meta:
        model = Email
        fields = ('id', 'subject', 'body', 'from_address', 'to_address', 'inbound')
