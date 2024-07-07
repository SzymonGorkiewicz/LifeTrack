
from django.urls import path
from .views import ProductView, DayView, WeekView, AddProductToMealView
urlpatterns = [
    path('product/', ProductView.as_view()),
    path('day/<int:id>', DayView.as_view()),
    path('week/', WeekView.as_view(), name='week-create'),
    path('meals/<int:meal_id>/add_product/', AddProductToMealView.as_view(), name='add-product-to-meal'),
]
