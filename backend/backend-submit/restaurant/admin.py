from django.contrib import admin


from .models import *


class RestaurantInfoAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'kakao_id', 'name', 'address']  # UUID 필드를 list_display에 추가


admin.site.register(RestaurantInfo, RestaurantInfoAdmin)
admin.site.register(Category)
admin.site.register(OpenHour)
admin.site.register(Menu)
admin.site.register(Review)
admin.site.register(Tags)
