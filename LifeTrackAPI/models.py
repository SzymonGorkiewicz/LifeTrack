from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
# Create your models here.


class Day(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(blank=False,null=False)
    total_protein = models.FloatField(default=0, blank=False, null=False)
    total_carbohydrates = models.FloatField(default=0, blank=False, null=False)
    total_fat = models.FloatField(default=0, blank=False, null=False)
    products = models.ManyToManyField('Product', related_name='product')
    
    def __str__(self):
        return f"{self.user.username} - {self.date}"

    def update_totals(self):
        consumptions = self.consumption_set.all()
        self.total_protein = sum(consumption.protein() for consumption in consumptions)
        self.total_carbohydrates = sum(consumption.carbohydrates() for consumption in consumptions)
        self.total_fat = sum(consumption.fat() for consumption in consumptions)
        self.save()

    def total_calories(self):
        return (self.total_protein * 4) + (self.total_carbohydrates * 4) + (self.total_fat * 9)

class Product(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True, blank=False)
    proteinPer100g = models.FloatField(blank=False,null=False)
    carbohydratesPer100g = models.FloatField(blank=False,null=False)
    fatPer100g = models.FloatField(blank=False,null=False)
    

    def __str__(self):
        return self.name

    def calories_per_100g(self):
        return (self.protein_per_100g * 4) + (self.carbohydrates_per_100g * 4) + (self.fat_per_100g * 9)


class Consumption(models.Model):
    day = models.ForeignKey(Day, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount_in_grams = models.FloatField(blank=False, null=False)

    def __str__(self):
        return f"{self.product.name} on {self.day.date}"

    def calories(self):
        return (self.product.calories_per_100g() * self.amount_in_grams) / 100

    def protein(self):
        return (self.product.protein_per_100g * self.amount_in_grams) / 100

    def carbohydrates(self):
        return (self.product.carbohydrates_per_100g * self.amount_in_grams) / 100

    def fat(self):
        return (self.product.fat_per_100g * self.amount_in_grams) / 100