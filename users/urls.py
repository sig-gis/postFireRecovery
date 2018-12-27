# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from users import views

urlpatterns = [
    url(r'^api/v1/user/$', views.UserList.as_view(), name='user-list'),
    url(r'^api/v1/user/login/', views.login, name='user-login'),
    url(r'^api/v1/user/register/', views.UserCreate.as_view(), name='user-create'),
    url(r'^api/v1/user/change_password/', views.UserChangePassword.as_view(), name='user-change-password'),
    url(r'^api/v1/user/profile/', views.UserProfile.as_view(), name='user-profile'),
    url(r'^api/v1/user/(?P<pk>[0-9]+)/$', views.UserDetail.as_view(), name='user-detail'),
]
