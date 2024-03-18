from __future__ import absolute_import, unicode_literals
from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodpalette.settings')

app = Celery('foodpalette')

# 'CELERY'라는 이름으로 시작하는 설정을 사용
app.config_from_object('django.conf:settings', namespace='CELERY')

# 등록된 Django 앱의 tasks.py 모듈을 찾아서 작업을 불러옴
app.autodiscover_tasks()
