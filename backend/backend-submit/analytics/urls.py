from django.urls import path, include
from . import views
from rest_framework import urls

urlpatterns = [
    path("category/gender/", view=views.TopMostVisitCategoryByGenderView.as_view(), name='category_by_gender'),
    path("category/age/", view=views.TopMostVisitCategoryByAgeView.as_view(), name="category_by_age"),
    path("score/", view=views.TopLocationByStrengthView.as_view(), name="gangan")
]