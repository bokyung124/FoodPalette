from django.db import models
from .models import RestaurantInfo

class RecommendGanganReview(models.Model):
    keyword = models.CharField(max_length=20, null=False, primary_key=True)
    category = models.CharField(max_length=20, null=False)
    kakao_id = models.IntegerField(null=False)
    # kakao = models.ForeignKey(RestaurantInfo, to_field="kakao_id", on_delete=models.CASCADE)
    sum_review = models.FloatField(default=None, null=True, blank=True)

    class Meta:
        managed = False  # Django ORM에 의해 데이터베이스 테이블 관리를 하지 않도록 설정
        db_table = 'recommend_gangan_review'  # 데이터베이스에 사용될 테이블 이름을 지정
        unique_together = (('keyword', 'category', 'kakao_id'),)  # 복합 키를 구현
        indexes = [
            models.Index(fields=['keyword', 'category', 'kakao_id']),
        ]

    def __str__(self):
        return f"{self.keyword}({self.kakao_id}) | {self.category} | {self.sum_review}"