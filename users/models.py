# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser

from core.models import Membership

# =============================================================================
class User(AbstractUser):
    pass

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
