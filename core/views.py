# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.conf import settings
from django.contrib.auth import authenticate, base_user
from django.core.mail import EmailMessage
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_201_CREATED

from core.models import Email, Organization, ContactUs as ContactUsModel
from core.serializers import ContactUsSerializer, OrganizationSerializer
from core.permissions import IsOrganizationOwner


# =============================================================================
class OrganizationList(generics.ListAPIView):
    serializer_class = OrganizationSerializer
    # permission_classes = (IsAuthenticated, )
    queryset = Organization.objects.all()


# =============================================================================
class OrganizationRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrganizationSerializer
    permission_classes = (IsOrganizationOwner,)

    # -------------------------------------------------------------------------
    def get_queryset(self):
        return Organization.objects.all().filter(pk=self.kwargs.get('pk'))


# =============================================================================
class ContactUs(generics.CreateAPIView):
    serializer_class = ContactUsSerializer

    # -------------------------------------------------------------------------
    def create(self, request):
        data = request.data
        # gather email table data
        name = data.get('name', None)
        subject = 'Enquiry from {}'.format(name)
        body = data.get('body', None)
        from_address = settings.EMAIL_HOST_USER
        to_address = settings.CONTACT_US_ADMIN
        reply_to = data.get('email', None)

        if not name or not body or not reply_to:
            return Response({'error': 'Make sure all fields are entered and valid.'},
                            status=HTTP_400_BAD_REQUEST)

        email_message = EmailMessage(subject, body, from_address, to_address,
                                     headers={'Reply-To': reply_to}
                                     )
        email_message.send()

        for _to_address in to_address:
            email_data = {
                'subject': subject,
                'body': body,
                'from_address': from_address,
                'to_address': _to_address,
                'reply_to': reply_to
            }

            try:
                email = Email.objects.create(**email_data)
            except Exception as e:
                return Response({
                    'status': 'Bad request',
                    'message': '{}'.format(e.message)
                }, status=HTTP_400_BAD_REQUEST)

            try:
                contact_us = ContactUsModel.objects.create(email=email, name=name)
            except Exception as e:
                return Response({
                    'status': 'Bad request',
                    'message': '{}'.format(e.message)
                }, status=HTTP_400_BAD_REQUEST)

        return Response('ok', status=HTTP_200_OK)
