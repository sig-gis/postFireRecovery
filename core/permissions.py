# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from rest_framework import permissions


# =============================================================================
class IsOrganizationOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user:
            if request.method in permissions.SAFE_METHODS:
                return True
            elif user.is_org_admin(user, obj.id):
                return True
        return False
# =============================================================================
