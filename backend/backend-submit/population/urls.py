from django.urls import path, include
from . import views
from rest_framework import urls

urlpatterns = [
    path('crowded/', views.crowded, name='crowded'),
    path('quiet/', views.quiet, name='quiet'),
]