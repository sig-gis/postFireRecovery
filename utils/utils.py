# -*- coding: utf-8 -*-

import random
import string
import time


# -----------------------------------------------------------------------------
def get_unique_string():
    """Returns a likely-to-be unique string."""

    random_str = ''.join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    date_str = str(int(time.time()))
    return date_str + random_str
