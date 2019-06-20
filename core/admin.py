# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.contrib import admin

from .models import Email, Organization, OrganizationAdmin

admin.site.register(Email)
admin.site.register(Organization, OrganizationAdmin)
