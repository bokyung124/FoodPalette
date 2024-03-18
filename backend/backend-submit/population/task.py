from __future__ import absolute_import, unicode_literals
from celery import shared_task
from django.core.cache import cache
from .population import get_population_list  


@shared_task
def update_population_list():
    population_list = get_population_list()
    cache.set('population_list', population_list, 300)  # 5분 동안 캐시에 데이터 저장