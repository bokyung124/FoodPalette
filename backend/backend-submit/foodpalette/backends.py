# foodpalette/backends.py

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailAuthBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # 해당 이메일을 가진 사용자가 없음
            return None
        
        # 사용자가 존재하고 비밀번호가 맞으면 사용자 객체 반환
        if user.check_password(password):
            return user
        else:
            # 비밀번호가 틀림
            return None
