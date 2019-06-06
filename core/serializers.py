# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from core.models import ContactUs, Email, Organization, Membership

# =============================================================================
class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = ('id', 'name', 'email_id')

# =============================================================================
class EmailSerializer(serializers.Serializer):
    class Meta:
        model = Email
        fields = ('id', 'subject', 'body', 'from_address', 'to_address', 'inbound')

# =============================================================================
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('id', 'name', 'url', 'year')

# =============================================================================
class MembershipSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField(source='organization.id')
    name = serializers.ReadOnlyField(source='organization.name')
    url = serializers.ReadOnlyField(source='organization.url')
    year = serializers.ReadOnlyField(source='organization.year')

    class Meta:
        model = Membership
        fields = ('id', 'name', 'url', 'year', 'position', 'is_admin')
# =============================================================================
