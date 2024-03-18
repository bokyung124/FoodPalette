# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model
import uuid

from population.models import GuInfo, CongestionInfo


class OpenHour(models.Model):
    opening_hours = models.CharField('open_hours', max_length=200, null=True)  # ["매일 09:00 ~ 21:00"]

    def __str__(self):
        return self.opening_hours


class Category(models.Model):
    name = models.CharField('category', max_length=50, null=True)

    def __str__(self):
        return self.name


class Menu(models.Model):
    description = models.TextField(blank=True)
    img = models.URLField(max_length=500, blank=True, null=True)
    menu = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.menu


# 주요 가게 정보
class Tags(models.Model):
    tag = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.tag


class RestaurantInfo(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kakao_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=50)
    source = models.CharField(max_length=2, blank=True, null=True)      # ('K', 'N', 'F')
    category = models.ManyToManyField(Category, related_name='category')
    tags = models.ManyToManyField(Tags, blank=True)
    gu = models.ForeignKey(GuInfo, related_name='restaurants', on_delete=models.CASCADE, null=True, blank=True)  # 하나의 구에만 속함
    locations = models.ManyToManyField(CongestionInfo, related_name='restaurants', blank=True)  # 하나의 식당이 여러 위치에 속함
    address = models.CharField(max_length=300)
    open_hours = models.ManyToManyField(OpenHour, related_name='open_hours', blank=True)
    phone = models.CharField(max_length=20)
    menu = models.ManyToManyField(Menu, related_name='menuItem')
    store_info_last_update = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name


# 네이버, 카카오에서 받아오는 리뷰 및 foodpalette에서 만들어진 리뷰
class Review(models.Model):
    NUMBER_CHOICES = [
        (0, '0점'),
        (1, '1점'),
        (2, '2점'),
        (3, '3점'),
        (4, '4점'),
        (5, '5점'),
    ]

    source = models.CharField(max_length=2, blank=True, null=True)     # ('K', 'N', 'F') 중 하나
    user = models.ForeignKey(get_user_model(), related_name='reviews', on_delete=models.CASCADE, null=True)
    restaurant = models.ForeignKey(RestaurantInfo, on_delete=models.CASCADE)
    username = models.CharField(max_length=50, null=True, blank=True)
    comment = models.TextField(blank=False, null=True)
    date = models.DateField(blank=True, null=True)
    rate = models.PositiveIntegerField(choices=NUMBER_CHOICES, default=0)

    def __str__(self):
        return f"{self.comment}"
