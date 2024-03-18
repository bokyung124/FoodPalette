from django.core.paginator import Paginator
from django.db.models import OuterRef, Subquery
from django.forms import model_to_dict
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views import View
from django.views.generic import ListView
from rest_framework import status, generics, filters, mixins
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, CreateAPIView, get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import Visit, FavoriteRestaurant
from population.models import CongestionInfo
from population.serializers import CongestionSerializer
from population.views import crowded, quiet
from .models import *
from .serializers import *
from .analytic_models import RecommendGanganReview

# 검색 페이지
class RestaurantSearchView(View):
    #     """
    #     /main/search?menu=국밥&congestion=혼잡&구=강남구&location=광화문
    #     """
    def get(self, request, *args, **kwargs):
        # 쿼리 파라미터에서 검색 조건 가져오기
        menu_query = request.GET.get('searchTerm')
        area_congest_query = request.GET.get('area_congest')
        gu_query = request.GET.get('gu')
        order_query = request.GET.get('order')

        # 초기 조건에 따른 queryset 필터링
        queryset = RestaurantInfo.objects.all()
        if menu_query:
            queryset = queryset.filter(menu__menu__icontains=menu_query)
        if gu_query:
            queryset = queryset.filter(gu__gu=gu_query)

        if area_congest_query:
            queryset = queryset.filter(locations__area_congest=area_congest_query)

            # 먼저, 각 RestaurantInfo 객체에 대해 가장 큰 area_population_max 값을 가진
            # CongestionInfo 객체의 area_congest 값을 찾기 위한 Subquery를 정의합니다.
            max_area_population_max = CongestionInfo.objects.filter(
                restaurants=OuterRef('pk')
            ).order_by('-area_population_max').values('area_congest')[:1]
            
            # 이제, 이 서브쿼리를 사용하여 area_congest 값이 'area_congest_query'인 RestaurantInfo 객체를 필터링합니다.
            queryset = queryset.annotate(
                max_congest=Subquery(max_area_population_max)
            ).filter(max_congest=area_congest_query)
        
        if order_query:
            # RecommendGanganReview에서 sum_review 값을 선택하는 서브쿼리를 생성합니다.
            sum_review_subquery = RecommendGanganReview.objects.filter(
                kakao_id=OuterRef('kakao_id')
            ).values('sum_review')
            
            # RestaurantInfo 모델을 쿼리하고, sum_review 값을 annotate를 통해 추가합니다.
            queryset = queryset.annotate(
                sum_review=Subquery(sum_review_subquery[:1])
            ).order_by('sum_review')

        # 페이징 처리
        paginator = Paginator(queryset, 10)  # 페이지당 10개씩 표시
        page_number = request.GET.get('page')  # page 파라미터로 요청된 페이지 번호 가져오기
        page_obj = paginator.get_page(page_number)  # 요청된 페이지에 대한 객체 가져오기

        # 직렬화
        serializer = RestaurantInfoSearchResultsSerializer(page_obj, many=True)
        
        
        # 페이징 및 직렬화된 데이터를 JSON으로 반환
        return JsonResponse({
            'results': serializer.data,
            'count': paginator.count,
            'next': page_obj.next_page_number() if page_obj.has_next() else None,
            'previous': page_obj.previous_page_number() if page_obj.has_previous() else None,
        }, safe=False)


# 가게 상세 페이지
class RestaurantDetailView(APIView):
    # 가게별 상세 정보 객체 가져오기
    def get_object(self, pk):
        try:
            return RestaurantInfo.objects.get(pk__icontains=pk)
        except RestaurantInfo.DoesNotExist:
            raise Http404

    # 가게의 혼잡도 정보 가져오기 - 가게가 속한 지역 중 혼잡도 지수가 가장 높은 지역의 혼잡도 정보로 제공
    def get_congestion_info(self, restaurant):
        congestions = restaurant.locations.order_by('-area_population_max').first()
        if congestions:
            return model_to_dict(congestions)
        return Response({})

    # 방문 횟수, 즐겨찾기 등록 횟수 가져오기
    def get_visits_and_favorites_info(self, restaurant):
        # 방문 횟수 집계
        visits_count = Visit.objects.filter(restaurant=restaurant).values('user').distinct().count()

        # 즐겨찾기 등록 횟수 집계
        favorites_count = FavoriteRestaurant.objects.filter(restaurant=restaurant).values('user').distinct().count()

        return {
            'visits_count': visits_count,
            'favorites_count': favorites_count
        }

    def get(self, request, pk):
        restaurant = self.get_object(pk)
        # congestion_info = self.get_congestion_info(restaurant)
        # visits_and_favorites_info = self.get_visits_and_favorites_info(restaurant)

        data = RestaurantInfoSerializer(restaurant).data
        # data['congestion_info'] = congestion_info
        # data.update(visits_and_favorites_info)

        return Response(data, status=status.HTTP_200_OK)


class CustomPagination(PageNumberPagination):
    page_size = 5
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 100


# 식당 리뷰 페이지 - 페이지네이션 적용
class RestaurantReviewView(ListAPIView):
    serializer_class = ReviewSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        restaurant = get_object_or_404(RestaurantInfo, pk=pk)
        return Review.objects.filter(restaurant=restaurant).order_by('-date')


class ReviewCreateView(mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


# 메인 페이지
class MainPageView(APIView):
    def get(self, *args, **kwargs):
        # 최근 리뷰들을 가져옵니다.
        reviews = Review.objects.all().order_by('-date')[:5]

        reviews_serializer = ReviewSerializer(reviews, many=True)

        # 검색 페이지로 넘어가는 URL 생성
        search_url = reverse('search')

        # 리뷰와 지역 정보
        return Response({
            'reviews': reviews_serializer.data,
            'search_url': search_url
        }, status=status.HTTP_200_OK)


# 혼잡도 페이지
class CongestionView(APIView):
    def get(self, request):
        # 사용자가 입력한 혼잡한 지역 개수
        crowded_count = int(request.query_params.get('crowded_count', 5))
        # 사용자가 입력한 한적한 지역 개수
        quiet_count = int(request.query_params.get('quiet_count', 5))

        # 혼잡한 상위 지역 가져오기
        crowded_areas = self.get_top_crowded_areas(crowded_count)

        # 한적한 상위 지역 가져오기
        quiet_areas = self.get_top_quiet_areas(quiet_count)

        return Response({
            'crowded_areas': crowded_areas,
            'quiet_areas': quiet_areas,
        }, status=status.HTTP_200_OK)

    def get_top_crowded_areas(self, count):
        # 혼잡도가 높은 순서대로 상위 지역 가져오기
        top_crowded_areas = CongestionInfo.objects.order_by('-area_population_max')[:count]
        crowded_areas_data = [{'area_name': area.location, 'population_max': area.area_population_max,
                               'area_congest': area.area_congest, 'request_time': area.request_time} for area in top_crowded_areas]
        return crowded_areas_data

    def get_top_quiet_areas(self, count):
        # 혼잡도가 낮은 순서대로 상위 지역 가져오기
        top_quiet_areas = CongestionInfo.objects.order_by('area_population_max')[:count]
        quiet_areas_data = [{'area_name': area.location, 'population_max': area.area_population_max,
                            'area_congest': area.area_congest, 'request_time': area.request_time} for area in top_quiet_areas]
        return quiet_areas_data
