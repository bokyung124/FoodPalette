from rest_framework import serializers
from .models import RecommendHotplaceCategoryAge, RecommendHotplaceCategoryGender, RecommendStrengthLocation


class RecommendHotplaceCategoryGenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendHotplaceCategoryGender
        fields = ['gender', 'category', 'count']


class RecommendHotplaceCategoryAgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendHotplaceCategoryAge
        fields = ['age', 'category', 'count']


class RecommendStrengthLocationSerializer(serializers.ModelSerializer):
    score = serializers.IntegerField()

    class Meta:
        model = RecommendStrengthLocation
        fields = ['strength', 'keyword', 'score']