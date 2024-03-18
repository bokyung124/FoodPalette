from rest_framework import serializers

from .models import *


class GuInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuInfo
        fields = '__all__'


class CongestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CongestionInfo
        fields = '__all__'
