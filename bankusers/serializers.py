from rest_framework import serializers
from .models import CustomUser
from bankaccounts.models import accounts
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueTogetherValidator
from rest_framework.validators import UniqueValidator
from django.core.validators import RegexValidator
from django import forms
from django.contrib.auth.password_validation import validate_password
# from django.contrib.auth.models import auth_user

class bankuserSerializer(serializers.ModelSerializer):

    type_ofusers=[
        ('admin','admin'),
        ('customer','customer'),
        ('staff','staff'),
        ('manager','manager'),
    ]

    username =serializers.CharField(max_length=200)
    email=serializers.EmailField()
    mobile_no = serializers.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$',
                message="Enter a valid Indian mobile number.",
                code="invalid_mobile_number"
            ),
            UniqueValidator(queryset=CustomUser.objects.all())
            ]
    )
    # date_of_birth = serializers.DateField(
    #     input_formats=['%d-%m-%Y'],  # Accepts date in 'DD-MM-YYYY' format
    #     help_text='Enter the date of birth in "DD-MM-YYYY" format.'
    # )
    user_type=serializers.ChoiceField(choices=type_ofusers,default ="customer")
    password=serializers.CharField(max_length=200)

    def create(self, validated_data):
        # Hash the password
        password = validated_data.pop('password')
        hashed_password = make_password(password)

        # Create and return the user instance
        user = CustomUser.objects.create(password=hashed_password, **validated_data)
        return user

    class Meta:
        model = CustomUser
        fields=('username', 'email','mobile_no','date_of_birth','user_type','password')
        # fields=('username', 'email','mob_no','dateofbirth','user_type','password')
    
        validators = [
                UniqueTogetherValidator(
                    queryset=CustomUser.objects.all(),
                    fields=['username']
                )
            ]

      
    
class bankaccntSerializer(serializers.ModelSerializer):
    # user=CustomerSerializer(many=True)
    account_number = serializers.IntegerField()
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    # is_active = serializers.BooleanField()
    # opened_date = serializers.DateField()
    class Meta:
        model = accounts
        fields =  '__all__'

class StaffUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','email','mobile_no','date_joined']
    
class CustomerRegSerializer(serializers.ModelSerializer):
    username =serializers.CharField(max_length=200)
    email=serializers.EmailField()
    mobile_no = serializers.CharField(
    max_length=15,
    validators=[
        RegexValidator(
            regex=r'^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$',
            message="Enter a valid Indian mobile number.",
            code="invalid_mobile_number"
        ),
        UniqueValidator(queryset=CustomUser.objects.all())
        ]
    )
    date_of_birth = serializers.DateField(
        input_formats=['%Y-%m-%d'],  # Accepts date in 'DD-MM-YYYY' format
        help_text='Enter the date of birth in "DD-MM-YYYY" format.'
    )
    password=serializers.CharField(max_length=200)

    def create(self, validated_data):
        # Hash the password
        password = validated_data.pop('password')
        hashed_password = make_password(password)

        # Create and return the user instance
        user = CustomUser.objects.create(password=hashed_password, **validated_data)
        return user

    class Meta:
        model = CustomUser
        fields=('username', 'email','mobile_no','date_of_birth','password')
        # fields=('username', 'email','mob_no','dateofbirth','user_type','password')
    
        validators = [
                UniqueTogetherValidator(
                    queryset=CustomUser.objects.all(),
                    fields=['username']
                )
            ]

class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'first_name', 'last_name', 'email')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return value

    def validate_username(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def update(self, instance, validated_data):
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.email = validated_data['email']
        instance.username = validated_data['username']

        instance.save()

        return instance
    
class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs
    def validatesameoldpswd(self, attrs):
        if attrs['old_password'] == attrs['password2']:
            raise serializers.ValidationError({"password": "please enter a new password."})
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance