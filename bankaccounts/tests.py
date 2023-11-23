from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework import status
from django.urls import reverse
from .views import AccountList,ActivateAccountView,AccountDeactivate
from rest_framework.test import APITestCase
from bankusers.models import CustomUser
from .models import accounts

class AccountListTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            user_type='staff'  # Assuming user is staff
        )

    def test_account_list(self):
        url = reverse('account-list')  # Replace with your actual endpoint name
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        view = AccountList.as_view()
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ActivateAccountViewTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='staff')
          # Create an inactive account

    def test_account_activation(self):
        self.account = accounts.objects.create(id=self.user,account_number='123456',balance=0.0, is_active=False)
        url = reverse('activate-account', kwargs={'account_number': '123456'})
        request = self.factory.post(url)
        force_authenticate(request, user=self.user)  # Simulate an authenticated user

        response = ActivateAccountView.as_view()(request, account_number='123456')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Account activated successfully"})
    
    def test_does_not_exist_account_activation(self):
        url = reverse('activate-account', kwargs={'account_number': '123456'})
        request = self.factory.post(url)
        force_authenticate(request, user=self.user)  # Simulate an authenticated user

        response = ActivateAccountView.as_view()(request, account_number='123456')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {"message": "Bank account does not exist"})

class DeactivateAccountViewTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='staff')
          # Create an inactive account

    def test_account_deactivation(self):
        self.account = accounts.objects.create(id=self.user,account_number='123456',balance=0.0, is_active=True)
        url = reverse('deactivate-account', kwargs={'account_number': '123456'})
        request = self.factory.post(url)
        force_authenticate(request, user=self.user)  # Simulate an authenticated user

        response = AccountDeactivate.as_view()(request, account_number='123456')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Account deactivated successfully"})
    
    def test_does_not_exist_account_deactivation(self):
        url = reverse('deactivate-account', kwargs={'account_number': '123456'})
        request = self.factory.post(url)
        force_authenticate(request, user=self.user)  # Simulate an authenticated user

        response = AccountDeactivate.as_view()(request, account_number='123456')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {"message": "Bank account does not exist"})
    
