from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from .services import get_or_create_product
from rest_framework.response import Response
from .serializers import ProductSerializer, DaySerializer, MealSerializer
from .models import Product, Day, Meal
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
# Create your views here.

class ProductView(APIView):
    
   def get(self, request):
        product_name = request.query_params.get('product_name')
        
        if not product_name:
            return Response({'error': 'Product name is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            api_data = get_or_create_product(product_name)
            if not api_data:
                return Response({'error': 'Product not found in API'}, status=status.HTTP_404_NOT_FOUND)
            serialized_data = ProductSerializer(api_data)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DayView(APIView):
    def get(self,request,id,format=None):
    
        day_id = get_object_or_404(Day,id=id)
        print(day_id)
        
        serializedday=DaySerializer(day_id)
        return Response(serializedday.data, status=status.HTTP_200_OK)
        
class WeekView(APIView):
    def post(self, request):
        user = request.user
        today = datetime.today().date()
        days = []

        for i in range(-7, 8):
            date = today + timedelta(days=i)
            day, created = Day.objects.get_or_create(user=user, date=date)
            if created:
                day.create_default_meals()
            days.append(day)

        serialized_days = DaySerializer(days, many=True)
        return Response(serialized_days.data, status=status.HTTP_201_CREATED)
    
    def get(self, request):
        user = request.user
        today = datetime.today().date()
        days = Day.objects.filter(user=user, date__range=[today - timedelta(days=7), today])
        
        if not days.exists():
                    return Response([], status=status.HTTP_200_OK)
        
        serialized_days = DaySerializer(days, many=True)
        return Response(serialized_days.data, status=status.HTTP_200_OK)
    
class AddProductToMealView(APIView):
    def post(self, request, meal_id):
        meal = get_object_or_404(Meal, id=meal_id)
        product_id = request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)

        meal.products.add(product)
        meal.save()

        serialized_meal = MealSerializer(meal)
        return Response(serialized_meal.data, status=status.HTTP_200_OK)