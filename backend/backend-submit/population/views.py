from django.shortcuts import render
from django.http import JsonResponse
from django.core.cache import cache
from .population import get_population_list


# 113개 목록 기준!
# 혼잡한 상위 5개 지역
def crowded(request):
    population_list = get_population_list()
    sorted_crowded_list = sorted(population_list, key=lambda x: x['area_ppltn_max'], reverse=True)
    top_5_crowded_list = sorted_crowded_list[:5]
    top_5_crowded_names = [area['area_name'] for area in top_5_crowded_list]
    return top_5_crowded_names


# 한적한 상위 5개 지역
def quiet(request):
    population_list = get_population_list()
    sorted_quiet_list = sorted(population_list, key=lambda x: x['area_ppltn_max'])
    top_5_quiet_list = sorted_quiet_list[:5]
    top_5_quiet_names = [area['area_name'] for area in top_5_quiet_list]
    return top_5_quiet_names
