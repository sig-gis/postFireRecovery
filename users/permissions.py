# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user:
            if request.method in permissions.SAFE_METHODS:
                return True
            return obj == request.user
        return False
