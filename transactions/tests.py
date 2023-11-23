from django.test import RequestFactory
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.test import force_authenticate
from .views import TransactionCreateView
from bankusers.models import CustomUser
from bankaccounts.models import accounts
from transactions.models import details
from django.test import TestCase
from unittest.mock import patch





from rest_framework_simplejwt.tokens import AccessToken
class TransactionCreateViewTest(APITestCase):
    def setUp(self):
        self.factory = RequestFactory()

        # Create your accounts or other required objects here for testing
    @patch('transactions.views.AccessToken')
    def test_transaction_deposit(self,mock_access_token):
        mock_access_token.return_value.payload = {'account_number': '1234567890'}
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='customer')
        self.account = accounts.objects.create(id=self.user,account_number=12345, is_active=True,balance=0.0)
        self.client.force_authenticate(user=self.user)
        url = reverse('transaction-detail')  # Replace 'your-transaction-endpoint' with the URL name
        data = {
            "transaction_type": "deposit",
            "amount": 100.0  # Add other required data for the transaction
        }
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.user)
        view = TransactionCreateView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 201)
    
    def test_transaction_withdrawal(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='customer')
        self.account = accounts.objects.create(id=self.user,account_number=12345, is_active=True,balance=1000.0)
        self.client.force_authenticate(user=self.user)
        url = reverse('transaction-detail')  # Replace 'your-transaction-endpoint' with the URL name
        data = {
            "transaction_type": "withdrawal",
            "amount": 100.0  # Add other required data for the transaction
        }
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.user)
        view = TransactionCreateView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 201)

    def test_invalid_transaction(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='customer')
        self.account = accounts.objects.create(id=self.user,account_number=12345, is_active=True,balance=0.0)
        self.client.force_authenticate(user=self.user)
        url = reverse('transaction-detail')  # Replace 'your-transaction-endpoint' with the URL name
        data = {
            "transaction_type": "transfer",
            "amount": 100.0  # Add other required data for the transaction
        }
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.user)
        view = TransactionCreateView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 400)
    
    def test_transaction_withdrawal_insufficientbalance(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='customer')
        self.account = accounts.objects.create(id=self.user,account_number=12345, is_active=True,balance=10.0)
        self.client.force_authenticate(user=self.user)
        url = reverse('transaction-detail')  # Replace 'your-transaction-endpoint' with the URL name
        data = {
            "transaction_type": "withdrawal",
            "amount": 100.0  # Add other required data for the transaction
        }
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.user)
        view = TransactionCreateView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 400)
    

    def test_not_exitbank_account_transaction_creation(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='testpassword',user_type='staff')
        self.client.force_authenticate(user=self.user)
        url = reverse('transaction-detail')  # Replace 'your-transaction-endpoint' with the URL name
        data = {
            "transaction_type": "deposit",
            "amount": 100.0  # Add other required data for the transaction
        }
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.user)
        view = TransactionCreateView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 404)

class ExportTransactionsCSVTestCase(TestCase):
    def setUp(self):
        # Create a user and account for the test
        self.user = CustomUser.objects.create_user(username='test_user', password='test_password')
        # Create an associated account for the user
        self.account = accounts.objects.create(id=self.user, account_number='123456',balance=0.0)
        self.transaction = details.objects.create(account_number=self.account,transaction_type='deposit',amount=500.0)

    def test_export_transactions_csv(self):
        self.client.force_login(self.user)
        response = self.client.get('export_transactions_csv')  # Replace with your URL

        self.assertEqual(response.status_code, 404)  # Check if the response is successful
        self.assertEqual(response['Content-Type'], 'text/csv')  # Check if the content type is CSV
        # Add more assertions as needed to validate the CSV content and other specific details.

