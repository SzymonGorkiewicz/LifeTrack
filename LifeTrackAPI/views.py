from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from .services import get_or_create_product
from rest_framework.response import Response
from .serializers import ProductSerializer, DaySerializer, MealSerializer, MealProductsSerializer, BodyStatsSerializer
from .models import Product, Day, Meal, MealProduct, BodyStats
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from django.http import Http404
# Create your views here.

class ProductView(APIView):
    
    def get(self, request, product_name):
            #product_name = request.query_params.get('product_name')
            
            if not product_name:
                return Response({'error': 'Product name is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                api_data = get_or_create_product(product_name)
                print(api_data)
                if not api_data:
                    return Response({'error': 'Product not found in API'}, status=status.HTTP_404_NOT_FOUND)
                serialized_data = ProductSerializer(api_data)
                return Response(serialized_data.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class AddProductView(APIView):

    def post(self, request, product_name, mealID):
        if not product_name:
            return Response({'error': 'Product name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not mealID:
            return Response({'error': 'Meal ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            
            product = get_or_create_product(product_name)
            
            if not product:
                return Response({'error': 'Product not found in API'}, status=status.HTTP_404_NOT_FOUND)

            try:
                meal = get_object_or_404(Meal,id=mealID)
                print(meal)
            except Http404:
                return Response({'error': 'Meal not found'}, status=status.HTTP_404_NOT_FOUND)

            product = Product.objects.get(name=product['name'])

            meal.products.add(product)
            meal.save()

            serialized_data = ProductSerializer(product)
            return Response(serialized_data.data, status=status.HTTP_201_CREATED)
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
        days = Day.objects.filter(user=user, date__range=[today - timedelta(days=7), today+timedelta(days=7)])
        
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
    
class Meals(APIView):
    def get(self,request,day_id):
        meals = Meal.objects.filter(day_id=day_id)
        serialized_meals = MealSerializer(meals, many=True)
        return Response(serialized_meals.data, status=status.HTTP_200_OK)
    
class MealProducts(APIView):
    def get(self, request, meal_id):
        try:
            meal = Meal.objects.get(id=meal_id)
        except Meal.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        meal_serializer = MealSerializer(meal)
        return Response(meal_serializer.data)
    
class SaveGramatureView(APIView):
    def post(self, request, product_id, meal_id):
        print(product_id)
        print(meal_id)
        meal = get_object_or_404(Meal, pk=meal_id)
        product = get_object_or_404(Product, pk=product_id)
        gramature = request.data.get('gramature')
        print(gramature)
        # Check if MealProduct already exists, if yes, update gramature, else create new
        meal_product, created = MealProduct.objects.get_or_create(meal=meal, product=product)
        meal_product.gramature = gramature
        meal_product.save()

        return Response({'message': 'Gramature saved successfully'})
        
    def get(self,request,product_id,meal_id):
        meal_products = MealProduct.objects.filter(meal_id=meal_id)
        meal_products_serialized = MealProductsSerializer(meal_products, many=True)
        return Response(meal_products_serialized.data)
    
    def delete(self, request,product_id, meal_id):
        meal_product = get_object_or_404(MealProduct, meal_id=meal_id, product_id=product_id)
        meal_product.delete()
        return Response({'message': 'deleted successfully'})
    
class GraphsView(APIView):
    def get(self,request,user_id):
        stats = BodyStats.objects.filter(user_id=user_id).order_by('date')
        stats_serialized = BodyStatsSerializer(stats, many=True)
        return Response(stats_serialized.data)