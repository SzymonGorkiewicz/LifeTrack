from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Day(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(blank=False, null=False)
    total_protein = models.FloatField(default=0, blank=False, null=False)
    total_carbohydrates = models.FloatField(default=0, blank=False, null=False)
    total_fat = models.FloatField(default=0, blank=False, null=False)

    def __str__(self):
        return f"{self.id}"
    
    def create_default_meals(self):
        Meal.objects.bulk_create([
            Meal(day=self, meal_type='breakfast'),
            Meal(day=self, meal_type='second_breakfast'),
            Meal(day=self, meal_type='lunch'),
            Meal(day=self, meal_type='afternoon_snack'),
            Meal(day=self, meal_type='dinner'),
        ])
    
    class Meta:
        unique_together = [['user', 'date']]

class Product(models.Model):
    name = models.CharField(max_length=50, null=False, unique=True, blank=False)
    protein_per_100g = models.FloatField(blank=False, null=False)
    carbohydrates_per_100g = models.FloatField(blank=False, null=False)
    fat_per_100g = models.FloatField(blank=False, null=False)
    calories_per_100g = models.FloatField(blank=False, null=False)

    def __str__(self):
        return self.name


class Meal(models.Model):
    MEAL_CHOICES = [
        ('breakfast', 'breakfast'),
        ('second_breakfast', 'second_breakfast'),
        ('lunch', 'lunch'),
        ('afternoon_snack', 'afternoon_snack'),
        ('dinner', 'dinner'),
    ]

    day = models.ForeignKey(Day, on_delete=models.CASCADE)
    meal_type = models.CharField(max_length=20, choices=MEAL_CHOICES, blank=False, null=False)
    products = models.ManyToManyField(Product, through='MealProduct', related_name='meals')

    def __str__(self):
        return f"{self.meal_type}"

class MealProduct(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    gramature = models.FloatField(default=100)  # Dodatkowe pole na gramaturę

    class Meta:
        unique_together = ('meal', 'product')  # Unikalna para meal i product

    def __str__(self):
        return f"{self.product.name} - {self.gramature}g"


class BodyStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    weight = models.FloatField(max_length=5, blank=False, null=False)
    chest_circ = models.FloatField(max_length=5, blank=False, null=False)
    waist_circ = models.FloatField(max_length=5, blank=False, null=False)
    date = models.DateField(blank=False, null=False)

    def __str__(self):
        return f"{self.user} - {self.date}"
    
@receiver(post_save, sender=Day)
def create_default_meals(sender, instance, created, **kwargs):
    if created:
        instance.create_default_meals()

@receiver(post_save, sender=User)
def create_initial_days(sender, instance, created, **kwargs):
    if created:
        today = datetime.today().date()
        for i in range(-6, 8):
            day_date = today + timedelta(days=i)
            Day.objects.create(user=instance, date=day_date)

