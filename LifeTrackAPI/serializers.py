from rest_framework import serializers
from .models import Day, Product, Consumption

class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name', 'proteinPer100g', 'carbohydratesPer100g', 'fatPer100g')