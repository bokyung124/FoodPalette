from rest_framework import serializers
from population.serializers import CongestionSerializer, GuInfoSerializer
from .models import *


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'


class OpenHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenHour
        fields = ['opening_hours']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = '__all__'


class RestaurantInfoSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    tags = TagsSerializer(read_only=True, many=True)
    open_hours = OpenHourSerializer(read_only=True, many=True)
    menu = MenuSerializer(read_only=True, many=True)
    locations = CongestionSerializer(read_only=True, many=True)

    class Meta:
        model = RestaurantInfo
        fields = '__all__'


class RestaurantInfoSearchResultsSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, many=True)
    tags = TagsSerializer(read_only=True, many=True)
    open_hours = OpenHourSerializer(read_only=True, many=True)
    menu = MenuSerializer(read_only=True, many=True)
    # locations 필드를 SerializerMethodField로 변경
    locations = serializers.SerializerMethodField()
    gu = GuInfoSerializer(read_only=True)
    
    class Meta:
        model = RestaurantInfo
        fields = '__all__'
    
    def get_locations(self, obj):
        location = obj.locations.order_by('-area_population_max').first()

        if location:
            return CongestionSerializer(location).data
        
        return None

