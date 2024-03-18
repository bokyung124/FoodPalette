from django.contrib import admin

from population.models import CongestionInfo, GuInfo


@admin.register(CongestionInfo)
class CongestionInfoAdmin(admin.ModelAdmin):
    list_display = ('location', 'area_population_max', 'area_congest')
    ordering = ('-conn_time', )


@admin.register(GuInfo)
class GuInfoAdmin(admin.ModelAdmin):
    list_display = ('gu', )
    ordering = ('gu', )

