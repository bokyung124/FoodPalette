from django.shortcuts import render
from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from .models import RecommendHotplaceCategoryAge, RecommendHotplaceCategoryGender, RecommendStrengthLocation
from. serializers import RecommendHotplaceCategoryGenderSerializer, RecommendHotplaceCategoryAgeSerializer, RecommendStrengthLocationSerializer


class TopMostVisitCategoryByAgeView(APIView):

    def get(self, request, *args, **kwargs):

        limit = self.request.query_params.get("limit", 5)
        
        try:
            limit = int(limit)
        except ValueError:
            limit = 5

        result = {}

        for age in [20, 30, 40, 50]:
            queryset = RecommendHotplaceCategoryAge.objects.filter(age=age).exclude(category="고기").order_by('-count')[:limit]
            serializer = RecommendHotplaceCategoryAgeSerializer(queryset, many=True)
            result[age] = serializer.data

        return Response(result)


class TopMostVisitCategoryByGenderView(APIView):
    def get(self, request, *args, **kwargs):

        limit = self.request.query_params.get("limit", 5)

        try:
            limit = int(limit)
        except ValueError:
            limit = 5
        
        result = {}

        for gender in ["M", "F"]:
            queryset = RecommendHotplaceCategoryGender.objects.filter(gender=gender).exclude(category="고기").order_by("-count")[:limit]
            serializer = RecommendHotplaceCategoryGenderSerializer(queryset, many=True)
            result[gender] = serializer.data
        
        return Response(result)


class TopLocationByStrengthView(APIView):
    def get(self, request, *args, **kwargs):

        limit = self.request.query_params.get("limit", 5)

        try:
            limit = int(limit)
        except ValueError:
            limit = 5
        
        result = {}

        # queryset = RecommendStrengthLocation.objects.values('strength', 'keyword').annotate(score=Sum('count')).order_by('-score')
        # serializer = RecommendStrengthLocationSerializer(queryset, many=True)

        for strength in ["가성비", "맛", "분위기", "주차", "친절"]:
            queryset = RecommendStrengthLocation.objects.filter(strength=strength).values('strength', 'keyword').annotate(score=Sum('count')).order_by('-score')[:limit]
            print(queryset)
    
            serializer = RecommendStrengthLocationSerializer(queryset, many=True)
            result[strength] = serializer.data
        
        return Response(result)