from django.db import models
from bankaccounts.models import accounts

# Create your models here.
class details(models.Model):
    account_number = models.ForeignKey(accounts, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    TRANSACTION_TYPES = (
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    )
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    transaction_date = models.DateTimeField(auto_now_add=True)
    currentbalance = models.DecimalField(max_digits=10, decimal_places=2,null=True)