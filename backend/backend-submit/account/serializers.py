from .models import *
from rest_framework import serializers
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

import uuid


class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    email = serializers.EmailField(required=True)
    nickname = serializers.CharField(required=True)
    name = serializers.CharField(required=True)

    def get_token(self, obj):
        token, created = Token.objects.get_or_create(user=obj)
        return token.key

    def validate(self, attrs):
        errors = {}
        if not attrs.get('email'):
            errors['email'] = 'Email Field is required.'
        if not attrs.get('nickname'):
            errors['nickname'] = 'Nickname Field is required.'
        if not attrs.get('name'):
            errors['name'] = 'Name Field is required.'

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        new_uuid = uuid.uuid4()
        user = User.objects.create_user(
            uuid=new_uuid,
            email=validated_data['email'],
            nickname=validated_data['nickname'],
            name=validated_data['name'],
            password=validated_data['password'],
            gender=validated_data['gender'],
            birth=validated_data['birth'],
            location=validated_data['location']
        )
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for (key, value) in validated_data.items():
            setattr(instance, key, value)
        
        if password is not None:
            instance.set_password(password)
        
        instance.save()
        return instance
    
    class Meta:
        model = User
        fields = ['uuid', 'email', 'nickname', 'name', 'password', 'gender', 'birth', 'location', 'token']
        extra_kwargs = {'password': {'write_only': True}}


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError(
            {'error': 'Unable to login with provided credentials'}
        )
    
    
class FavoriteRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteRestaurant
        fields = ['id', 'user', 'restaurant', 'updated_at']


class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['user', 'restaurant', 'updated_at']
