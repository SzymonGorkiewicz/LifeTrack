from django.contrib import admin
from .models import Day, Product, Meal
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)

admin.site.register(Day)
admin.site.register(Product)
admin.site.register(Meal, ProductAdmin)