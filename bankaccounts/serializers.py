from rest_framework import serializers
from bankusers.models import CustomUser
from .models import accounts





class userSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source=CustomUser.id)
    name = serializers.CharField(source=CustomUser.username)
    email = serializers.EmailField(source=CustomUser.email)

    account_number = serializers.IntegerField()
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_active = serializers.BooleanField()
    opened_date = serializers.DateField()
    class Meta:
        model = CustomUser
        fields = '__all__'

class bankaccntSerializer(serializers.ModelSerializer):
    # account=userSerializer()
    account_number = serializers.IntegerField()
    # balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    # is_active = serializers.BooleanField()
    # opened_date = serializers.DateField()
    class Meta:
        model = accounts
        fields =  ['account_number','is_active']

# class UserAccountSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ('id', 'account_number','username', 'email','balance')  # Include user fields

#     account_number = serializers.IntegerField(source='accounts.account_number')
#     balance = serializers.DecimalField(max_digits=10, decimal_places=2, source='accounts.balance')
#     # Include fields from the Account model

#     def to_representation(self, instance):
#         # Assuming the 'instance' contains a CustomUser instance
#         data = super(UserAccountSerializer, self).to_representation(instance)
#         return data


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']  

class accntdetailsSerializer(serializers.ModelSerializer):
    user=CustomerSerializer(many=True)
    account_number = serializers.IntegerField()
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    # is_active = serializers.BooleanField()
    # opened_date = serializers.DateField()
    class Meta:
        model = accounts
        fields =  '__all__'

