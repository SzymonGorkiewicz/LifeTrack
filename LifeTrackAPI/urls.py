
from django.urls import path
from .views import ProductView, DayView, WeekView, AddProductToMealView, Meals, MealProducts, AddProductView, SaveGramatureView, GraphsView
urlpatterns = [
    path('product/<str:product_name>/', ProductView.as_view()),
    path('product/<str:product_name>/<int:mealID>/', AddProductView.as_view()),
    path('day/<int:id>', DayView.as_view()),
    path('week/', WeekView.as_view(), name='week-create'),
    path('meals/<int:meal_id>/add_product/', AddProductToMealView.as_view(), name='add-product-to-meal'),
    path('meals/<int:day_id>/', Meals.as_view()),
    path('meals/<int:meal_id>/products/', MealProducts.as_view()),
    path('meal/<int:product_id>/<int:meal_id>/', SaveGramatureView.as_view()),
    path('graphs/<int:user_id>/', GraphsView.as_view()),
    

]
