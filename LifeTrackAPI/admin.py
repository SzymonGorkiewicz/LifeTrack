from django.contrib import admin
from .models import Day, Product, Consumption
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)

admin.site.register(Day, ProductAdmin)
admin.site.register(Product)
admin.site.register(Consumption)