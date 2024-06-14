from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, logout
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
# Create your views here.


class Register(APIView):

    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            return Response ({'message' : 'Registered succesfully.'},status=status.HTTP_201_CREATED)
        return Response ({'error' : user_serializer.errors},status=status.HTTP_400_BAD_REQUEST)
    

class Login(APIView):
    permission_classes=()
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token,created = Token.objects.get_or_create(user=user)
            return Response ({'message' : 'Login succesfully.', 'token' : token.key},status=status.HTTP_201_CREATED)
        else:
            return Response ({'error' : 'Invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
        
class Logout(APIView):
    authentication_classes=[TokenAuthentication] 

    def post(self,request):
        token = get_object_or_404(Token, user=request.user)
        token.delete()
        logout(request)
        return Response({'message':'Logged out succesfully!'},status=status.HTTP_200_OK)