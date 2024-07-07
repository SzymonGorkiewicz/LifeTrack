from rest_framework import serializers
from .models import Day, Product, Meal

class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name', 'protein_per_100g', 'carbohydrates_per_100g', 'fat_per_100g', 'calories_per_100g')

class MealSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = '__all__'