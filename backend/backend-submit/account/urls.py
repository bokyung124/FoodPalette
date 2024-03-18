from django.urls import path, include
from . import views
from rest_framework import urls, routers

router = routers.DefaultRouter()
router.register('visit', views.VisitViewSet, basename='visit')
router.register('favorite', views.FavoriteRestaurantViewSet, basename='favorite')

urlpatterns =[
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('delete/', views.DeleteUserView.as_view(), name='delete'),
    path('profile/<str:uuid>/', views.UserView.as_view(), name='profile'),
    path('', include(router.urls)),
]
