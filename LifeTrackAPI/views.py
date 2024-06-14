from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from .services import get_or_create_product
from rest_framework.response import Response
from .serializers import ProductSerializer, DaySerializer
from .models import Product, Day
from django.shortcuts import get_object_or_404
# Create your views here.

class ProductView(APIView):
    
   def get(self, request):
        product_name = request.query_params.get('product_name')
        
        if not product_name:
            return Response({'error': 'Product name is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            api_data = get_or_create_product(product_name)
            if not api_data:
                return Response({'error': 'Product not found in API'}, status=status.HTTP_404_NOT_FOUND)
            serialized_data = ProductSerializer(api_data)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DayView(APIView):
    def get(self,request,id,format=None):
    
        day_id = get_object_or_404(Day,id=id)
        print(day_id)
        
        serializedday=DaySerializer(day_id)
        return Response(serializedday.data, status=status.HTTP_200_OK)
        
        