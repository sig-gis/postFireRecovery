# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

from core.models import Membership

# =============================================================================
#class User(AbstractUser):
#    pass

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group, related_name='user_groups', blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups', )
    user_permissions = models.ManyToManyField(
        Permission, related_name='user_permissions', blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions', )

# =============================================================================
def is_org_admin(self, user, org_id):
    admin_objects = Membership.objects.filter(user=user, is_admin=True)
    for admin_object in admin_objects:
        organization_id = admin_object.serializable_value('organization_id')
        if organization_id and org_id == organization_id:
            return True
            break
    return False

User.add_to_class('is_org_admin', is_org_admin)
# =============================================================================
