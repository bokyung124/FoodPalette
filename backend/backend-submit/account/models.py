from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

import restaurant

from datetime import datetime
import uuid


class UserManager(BaseUserManager):    
    # 일반 user 생성
    def create_user(self, email, nickname, name, password, birth=None, gender=None,
                    location=None, is_staff=False, **extra_fields):
        user = self.model(
            email=self.normalize_email(email),
            nickname=nickname,
            name=name,
            birth=birth,
            gender=gender,
            location=location,
            is_staff=is_staff,
            **extra_fields
        )
        user.set_password(password)
        user.full_clean()  # Validate the model fields
        user.save(using=self._db)
        return user

    # 관리자 user 생성
    def create_superuser(self, email, nickname, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')

        extra_fields.setdefault('birth', None)
        extra_fields.setdefault('gender', None)
        extra_fields.setdefault('location', None)

        return self.create_user(email, nickname, name, password, **extra_fields)


class User(AbstractBaseUser):
    GENDER_CHOICES = (
        ('male', '남자'),
        ('female', '여자'),
    )

    LOCATION = (
        ('강남구', '강남구'),
        ('강동구', '강동구'),
        ('강북구', '강북구'),
        ('강서구', '강서구'),
        ('관악구', '관악구'),
        ('광진구', '광진구'),
        ('구로구', '구로구'),
        ('금천구', '금천구'),
        ('노원구', '노원구'),
        ('도봉구', '도봉구'),
        ('동대문구', '동대문구'),
        ('동작구', '동작구'),
        ('마포구', '마포구'),
        ('서대문구', '서대문구'),
        ('서초구', '서초구'),
        ('성동구', '성동구'),
        ('성북구', '성북구'),
        ('송파구', '송파구'),
        ('양천구', '양천구'),
        ('영등포구', '영등포구'),
        ('용산구', '용산구'),
        ('은평구', '은평구'),
        ('종로구', '종로구'),
        ('중구', '중구'),
        ('중랑구', '중랑구')
    )
    
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(null=False, blank=False, unique=True)
    nickname = models.CharField(max_length=100, null=False, blank=False)
    name = models.CharField(max_length=100, null=False, blank=False)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, blank=True, null=True)
    birth = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, choices=LOCATION, blank=True, null=True)
    
    # User 모델의 필수 field
    is_active = models.BooleanField(default=True)    
    is_staff = models.BooleanField(default=False)
    
    # 헬퍼 클래스 사용
    objects = UserManager()

    # 사용자의 username field는 email로 수정
    USERNAME_FIELD = 'email'
    # 필수로 작성해야하는 field
    REQUIRED_FIELDS = ['nickname', 'name']

    def has_module_perms(self, app_label):
        return self.is_staff

    def has_perm(self, perm, obj=None):
        return self.is_staff

    def __str__(self):
        return self.email
    

# 즐겨찾기
class FavoriteRestaurant(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    restaurant = models.ForeignKey('restaurant.RestaurantInfo', on_delete=models.CASCADE)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        unique_together = ('user', 'restaurant')  

    def __str__(self):
        return self.restaurant.name


# 방문 식당
class Visit(models.Model):
    user = models.ForeignKey(get_user_model(), related_name='visits', on_delete=models.CASCADE)
    restaurant = models.ForeignKey('restaurant.RestaurantInfo', on_delete=models.CASCADE)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.restaurant.name
