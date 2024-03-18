from django.contrib import admin
from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *

urlpatterns = [
    path('', MainPageView.as_view(), name='main_page'),
    path('congestion/', CongestionView.as_view(), name='congestion'),
    path('search/', RestaurantSearchView.as_view(), name='search'),
    path('search/<str:pk>/', RestaurantDetailView.as_view(), name='restaurant_details'),
    path('search/<str:pk>/reviews/', RestaurantReviewView.as_view(), name='restaurant_reviews'),
    path('search/<str:pk>/reviews/create/', ReviewCreateView.as_view(), name='review_create'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
