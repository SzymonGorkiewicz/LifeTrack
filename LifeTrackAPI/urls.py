
from django.urls import path
from .views import ProductView, DayView
urlpatterns = [
    path('product/', ProductView.as_view()),
    path('day/<int:id>', DayView.as_view())
]
