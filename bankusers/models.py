from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class CustomUser(AbstractUser, PermissionsMixin):
    USER_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('staff', 'Staff'),
        ('customer', 'Customer'),
    ]

    user_type = models.CharField(max_length=20, null=True, choices=USER_TYPE_CHOICES)
    mobile_no = models.CharField(max_length=15,null=True,unique=True)
    date_of_birth = models.DateField(null=True)
    username = models.CharField(unique=True, max_length=150)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    # Add other fields as needed

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    

# class bankusers(models.Model):
#     username = models.CharField(max_length=255)
#     email = models.CharField(max_length=50)
#     mob_no = models.CharField(max_length=10)
#     password = models.CharField(max_length=10)
#     user_type = models.CharField(max_length=20)
#     is_active = models.BooleanField(default=True)
#     dateofbirth= models.DateField(default='1990-01-01')