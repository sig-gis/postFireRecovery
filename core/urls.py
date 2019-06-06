# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from core import views

urlpatterns = [
    url(r'^api/v1/contact-us/$', views.ContactUs.as_view(), name='contact-us'),
    url(r'^api/v1/organization/$', views.OrganizationList.as_view(), name='organization-list'),
    url(r'^api/v1/organization/(?P<pk>[0-9]+)/$', views.OrganizationRetrieveUpdateDestroy.as_view(), name='organization-create-read'),
]
