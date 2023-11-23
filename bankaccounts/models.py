from django.db import models
from bankusers.models import CustomUser

# Create your models here.

class accounts(models.Model):
     id = models.ForeignKey(CustomUser, to_field='id', on_delete=models.CASCADE)
     account_number = models.PositiveIntegerField(primary_key=True, unique=True, default=4000)
     balance = models.DecimalField(max_digits=10, decimal_places=2)
     is_active = models.BooleanField(default=False, null=False, blank=False)
     opened_date = models.DateField(null=True)
