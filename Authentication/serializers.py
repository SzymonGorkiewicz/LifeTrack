from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','email','first_name','last_name','password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_password(self,value):
        validate_password(value)
        return value

    def create(self,validated_data):
        user = User(email=validated_data['email'],username=validated_data['username'],first_name=validated_data["first_name"],last_name=validated_data["last_name"])
        user.set_password(validated_data['password'])
        user.save()
        return user