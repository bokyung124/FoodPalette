from django.db import models


class RecommendHotplaceCategoryGender(models.Model):
    gender = models.CharField(max_length=5, primary_key=True)
    category = models.CharField(max_length=20)
    count = models.IntegerField(null=True, default=None)

    class Meta:
        managed = False
        db_table = 'recommend_hotplace_category_gender'
        unique_together = (('gender', 'category'),)


class RecommendHotplaceCategoryAge(models.Model):
    age = models.IntegerField(primary_key = True)
    category = models.CharField(max_length=20)
    count = models.IntegerField(null=True, default=None)

    class Meta:
        managed = False  # Django ORM에 의해 데이터베이스 테이블 관리를 하지 않도록 설정
        db_table = 'recommend_hotplace_category_age'  # 실제 데이터베이스 테이블 이름
        unique_together = (('age', 'category'),)  # age와 category의 조합으로 유니크 제약 설정
 

class RecommendStrengthLocation(models.Model):
    keyword = models.CharField(max_length=20, primary_key=False, null=False)
    kakao_id = models.IntegerField(null=False, primary_key=False)
    strength = models.CharField(max_length=20, null=False, primary_key=True)
    count = models.IntegerField(default=None, null=True, blank=True)

    class Meta:
        managed = False  # Django ORM에 의해 데이터베이스 테이블 관리를 하지 않도록 설정
        db_table = 'recommend_by_keyword'  # 데이터베이스에 사용될 테이블 이름 지정
        unique_together = (('keyword', 'kakao_id', 'strength'),)  # 복합 키 설정
        indexes = [
            models.Index(fields=['keyword', 'kakao_id', 'strength']),
        ]