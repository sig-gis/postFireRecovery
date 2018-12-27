# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.contrib.auth import authenticate, base_user
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_201_CREATED

from users.models import User as UserModel
from users.serializers import UserSerializer, ChangePasswordSerializer, UserProfileUpdateSerializer
from users.permissions import IsOwner

@csrf_exempt
@api_view(['POST'])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'username': user.get_username(),
    }, status=HTTP_200_OK)

class UserCreate(generics.CreateAPIView):
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = UserModel.objects.create_user(**serializer.validated_data)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.get_username(),
            }, status=HTTP_200_OK)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=HTTP_400_BAD_REQUEST)

class UserList(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsOwner, )

    def get_queryset(self):
        return UserModel.objects.all().filter(pk=self.kwargs.get('pk'))

class UserProfile(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsOwner, )

    def get_queryset(self):
        return UserModel.objects.filter(id=self.request.user.id)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj

    def update(self, request):
        self.object = self.get_object()
        serializer = UserProfileUpdateSerializer(data=request.data)

        if serializer.is_valid():

            data = serializer.data.get
            username = data('username')
            username = base_user.AbstractBaseUser.normalize_username(username)

            first_name = data('first_name', None)
            last_name = data('last_name', None)
            email = data('email', None)
            if email:
                email = base_user.BaseUserManager.normalize_email(email)

            user = self.request.user
            user.username = username
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if email:
                user.email = email

            user.save()

            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key,
                'username': user.get_username(),
            }, status=HTTP_200_OK)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

class UserChangePassword(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (IsOwner, )

    def get_queryset(self):
        return UserModel.objects.filter(id=self.request.user.id)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj

    def update(self, request):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get('old_password')):
                return Response({
                    'status': 'Bad request',
                    'message': 'Old password is wrong!'
                }, status=HTTP_400_BAD_REQUEST)

            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get('new_password'))
            self.object.save()

            # update the token as well
            user = self.request.user
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)

            return Response({
                'token': token.key,
                'username': user.get_username(),
            }, status=HTTP_200_OK)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
