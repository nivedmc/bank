from rest_framework import serializers
from .models import details
from bankaccounts.models import accounts

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = details
        fields = ['id', 'account_number', 'amount', 'transaction_type', 'transaction_date']

class accountSerializer(serializers.ModelSerializer):
    class Meta:
        model=accounts
        fields = ['account_number','balance']