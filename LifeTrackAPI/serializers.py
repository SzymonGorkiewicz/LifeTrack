from rest_framework import serializers
from .models import Day, Product

class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name', 'protein_per_100g', 'carbohydrates_per_100g', 'fat_per_100g', 'calories_per_100g')