# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models

class Email(models.Model):

    sent_on = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=78) # max_length=78 - RFC 2822
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

    def __str__(self):              # __unicode__ on Python 2
        return "%s" % (self.from_address)

class ContactUs(models.Model):

    name = models.CharField(max_length=254, help_text='Name of the sender')
    email = models.ForeignKey(Email, on_delete=models.CASCADE)

    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"users_contact_us"'

    def __str__(self):
        return self.name + "-" +  self.email
