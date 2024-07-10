from django.contrib import admin
from .models import Day, Product, Meal, MealProduct, BodyStats
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)

admin.site.register(Day)
admin.site.register(Product)
admin.site.register(Meal, ProductAdmin)
admin.site.register(MealProduct)
admin.site.register(BodyStats)