# -*- coding: utf-8 -*-
from __future__ import absolute_import, print_function, unicode_literals

#from .views import login

from cms.sitemaps import CMSSitemap
from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.static import serve
from django.views.generic import TemplateView

from rest_framework.authtoken import views
from rest_framework.urlpatterns import format_suffix_patterns

from classifications import api as classifications_api

admin.autodiscover()

urlpatterns = [
    url(r'^sitemap\.xml$', sitemap,
        {'sitemaps': {'cmspages': CMSSitemap}}),
    url(r'^admin/', include(admin.site.urls)),  # NOQA
]

urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^api-token-auth/', views.obtain_auth_token),
]

urlpatterns += [
    url(r'^', include('users.urls', namespace='user')),
    url(r'^api/landcover/$', classifications_api.api),
]

urlpatterns += [
    url(r'^.*$', TemplateView.as_view(template_name='layout.html')),
    #url(r'^home/', TemplateView.as_view(template_name='map.html')),
]

urlpatterns = format_suffix_patterns(urlpatterns)

# This is only needed when using runserver.
if settings.DEBUG:
    urlpatterns = [
        url(r'^media/(?P<path>.*)$', serve,
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        ] + staticfiles_urlpatterns() + urlpatterns
