from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate
from .serializers import *
from .models import *
from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import NotFound
from rest_framework.response import Response


# 회원가입
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# 로그인
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        user_data = UserSerializer(user).data
        return Response(user_data, status=status.HTTP_200_OK)


# 회원정보 수정
class UserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        try:
            return User.objects.get(uuid=self.kwargs['uuid'])
        except User.DoesNotExist:
            raise NotFound("User not found")

# 로그아웃
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)  


# 회원탈퇴
class DeleteUserView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


# 즐겨찾기
class FavoriteRestaurantViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteRestaurantSerializer
    permission_classes = [IsAuthenticated]  # 인증된 유저만 접근 가능

    def get_queryset(self):
        """
        이 뷰셋은 현재 인증된 유저의 즐겨찾는 레스토랑 목록만 반환합니다.
        """
        return FavoriteRestaurant.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
            
        # 중복 체크
        user = request.user
        restaurant_id = request.data.get("restaurant")

        if FavoriteRestaurant.objects.filter(user=user, restaurant_id=restaurant_id).exists():
            return Response({"detail": "이미 즐겨찾기 추가된 가게입니다."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# 방문 식당
class VisitViewSet(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer
