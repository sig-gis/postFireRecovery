# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers

from core.serializers import MembershipSerializer
from users.models import User as UserModel

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    organization = MembershipSerializer(source='membership_set', many=True)

    def create(self, validated_data):

        user = UserModel.objects.create(
            username=validated_data.get('username', None)
        )
        user.set_password(validated_data.get('password', None))
        user.save()

        return user

    def update(self, instance, validated_data):
        for field in validated_data:
            if field == 'password':
                instance.set_password(validated_data.get(field))
            else:
                instance.__setattr__(field, validated_data.get(field))
        instance.save()

        return instance

    class Meta:
        model = UserModel
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name', 'organization')

class UserReadSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    organization = MembershipSerializer(source='membership_set', many=True)

    class Meta:
        model = UserModel
        fields = ('id', 'email', 'username', 'password', 'first_name', 'last_name', 'organization')

class ChangePasswordSerializer(serializers.Serializer):
    '''
    Serializer for password change endpoint.
    '''

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

class UserProfileUpdateSerializer(serializers.Serializer):
    '''
    Serializer for user profile update endpoint.
    '''

    username = serializers.CharField(required=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    organization = MembershipSerializer(source='membership_set', many=True, required=False)
