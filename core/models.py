# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.conf import settings
from django.contrib import admin
from django.db import models


# =============================================================================
class Email(models.Model):
    sent_on = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=78)  # max_length=78 - RFC 2822
    body = models.TextField()
    from_address = models.EmailField()
    to_address = models.EmailField()
    reply_to = models.EmailField()
    # incoming or outgoing?
    inbound = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"msg_email"'

    def __str__(self):  # __unicode__ on Python 2
        return "%s" % self.from_address


# =============================================================================
class ContactUs(models.Model):
    name = models.CharField(max_length=254, help_text='Name of the sender')
    email = models.ForeignKey(Email, on_delete=models.CASCADE)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"users_contact_us"'

    def __str__(self):
        return '{} - {}'.format(self.name, self.email)


# =============================================================================
class Organization(models.Model):
    name = models.CharField(max_length=254, blank=False)
    url = models.URLField(blank=True, null=True)
    year = models.PositiveSmallIntegerField(blank=True, null=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, through='Membership')

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"org_organization"'

    def __str__(self):
        return self.name


# =============================================================================
class Membership(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        # related_name='membership' # default is 'membership_set'
    )
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    position = models.CharField(max_length=254, blank=True, null=True)
    is_admin = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"org_organization_user"'

    def __str__(self):
        return '{} : {} at {}'.format(self.user, self.position, self.organization)


# =============================================================================

class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 1


# =============================================================================

class OrganizationAdmin(admin.ModelAdmin):
    inlines = (MembershipInline,)

# =============================================================================
