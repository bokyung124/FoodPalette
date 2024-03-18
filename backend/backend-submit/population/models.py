from django.db import models
# Create your models here.


# 혼잡도 정보
class CongestionInfo(models.Model):
    conn_time = models.DateTimeField()
    location = models.CharField(max_length=20, primary_key=True, null=False)
    api_location = models.CharField(max_length=20, unique=False, null=True)
    gu = models.ForeignKey("GuInfo", on_delete=models.CASCADE)
    area_code = models.CharField(max_length=20)
    area_congest = models.CharField(max_length=10)
    area_congest_msg = models.CharField(max_length=255)
    area_population_min = models.IntegerField()
    area_population_max = models.IntegerField()
    male_rate = models.DecimalField(default=0.0, max_digits=8, decimal_places=2)
    female_rate = models.DecimalField(default=0.0, max_digits=8, decimal_places=2)
    fcst_yn = models.CharField(max_length=2)
    request_time = models.DateTimeField(null=False)
    created_at = models.DateTimeField(blank=True, auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, auto_now=True)

    def __str__(self):
        return self.location


# 구 - location
class GuInfo(models.Model):
    gu = models.CharField('seoul_gu', max_length=10, unique=True, null=False, blank=False)

    def __str__(self):
        return self.gu
