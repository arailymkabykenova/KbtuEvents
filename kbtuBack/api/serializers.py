from rest_framework import serializers
from .models import CustomerUser
class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=CustomerUser
        fields=['username','email','password', 'school', 'yearOfStudy']

    #переопределили сreate ->потому  что в дефолтным не хэшируются пароли
    def create(self,validated_data):
        user=CustomerUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            school=validated_data['school'],
            yearOfStudy=validated_data['yearOfStudy']
        )
        return user