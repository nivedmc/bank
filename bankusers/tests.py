from rest_framework.test import APIRequestFactory
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .views import RegisterView,PendingAccountList,StaffManagment,CustomerActivation,CustomTokenObtainPairSerializer,TokenObtainPairView
from bankusers.models import CustomUser
from bankaccounts.models import accounts
from bankaccounts.serializers import bankaccntSerializer
from rest_framework.test import force_authenticate
from rest_framework import status
from rest_framework.test import APITestCase

class RegisterViewTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.User = get_user_model()

    def test_register_view(self):
        url = reverse('userregistration')  # Replace 'register' with your actual endpoint name
        data = {
            'username': 'testuser',
            'email':'testuser@gmail.com',
            'mobile_no':'8089114417',
            'date_of_birth':'2000-09-09',
            'password': 'testpassword',
            'user_type': 'customer',  # Assuming you are creating a customer
            # Other required fields for the serializer
        }
        request = self.factory.post(url, data, format='json')
        response = RegisterView.as_view()(request)
        
        # Check for the status code and other expectations
        self.assertEqual(response.status_code, 200)  # Replace 201 with your expected status code

        # Add assertions to verify the user, user account, etc., as per your application logic
        user = self.User.objects.get(username='testuser')
        self.assertTrue(user)
        # Your other assertions here

    def test_register_view_with_invalid_email(self):
        url = reverse('userregistration')  
        data = {
            'username': 'testuser',
            'email': 'invalidemail',  
            'password': 'testpassword',
            'user_type': 'customer',  
        }
        request = self.factory.post(url, data, format='json')
        response = RegisterView.as_view()(request)
        self.assertEqual(response.status_code, 400) 
        self.assertIn('email', response.data)

    def test_register_view_with_duplicate_username(self):
        url = reverse('userregistration') 
        data = {
            'username': 'nivedmc', 
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'user_type': 'customer',  
        }
        request = self.factory.post(url, data, format='json')
        response = RegisterView.as_view()(request)
        self.assertEqual(response.status_code, 400) 
        self.assertIn('username', response.data)

    def test_register_view_with_invaliduserregistration(self):
        url = reverse('userregistration') 
        data = {
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'user_type': 'customer',  
        }
        request = self.factory.post(url, data, format='json')
        response = RegisterView.as_view()(request)
        self.assertEqual(response.status_code, 400) 
        self.assertIn('username', response.data)

    def test_register_view_with_invalidemailformat(self):
        url = reverse('userregistration') 
        data = {
            'username': 'nivedmc123', 
            'email': 'newuserexamplecom',
            'password': 'newpassword',
            'user_type': 'customer',  
        }
        request = self.factory.post(url, data, format='json')
        response = RegisterView.as_view()(request)
        self.assertEqual(response.status_code, 400) 
        # self.assertIn('username', response.data)

# class PendingAccountListTestCase(TestCase):
#     def setUp(self):
#         self.factory = APIRequestFactory()

#     def test_pending_account_list(self):
#         # Create a pending account instance
#         customer = CustomUser.objects.create(username = 'abc')
#         account = accounts.objects.create(id=customer, account_number=12345, balance=100, is_active=False)
#         serializer = bankaccntSerializer(account)

#         # Create a request instance
#         url = reverse('pendingcustomers')  # Replace 'pending-accounts-list' with your URL name
#         request = self.factory.get(url)

#         # Instantiate the view and get the response
#         view = PendingAccountList.as_view()
#         response = view(request)

#         self.assertEqual(response.status_code, 200)  # Replace 200 with the expected status code

#         # Validate the response data according to your serializer
#         self.assertEqual(response.data, serializer.data)

class StaffManagmentTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(username='manager', password='password', user_type='manager')
        self.staff_user = CustomUser.objects.create_user(username='staff_user', password='password', user_type='staff')
        self.url = reverse('staffmanage') 
        
    def test_staff_management_view(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)  # Authenticated request with a manager user

        view = StaffManagment.as_view()
        response = view(request)

        # Check if the response status is HTTP 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CustomerActivationTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.staff_user = CustomUser.objects.create_user(username='staff', password='password', user_type='staff')
        self.customer = CustomUser.objects.create(username = 'abc')
        self.account = accounts.objects.create(id=self.customer,account_number=12345, is_active=False,balance=0.0)

        self.url = reverse('customeractivation', args=[self.account.account_number])  # Replace 'your_url_name' with your actual endpoint name

    def test_customer_activation_view(self):
        request = self.factory.put(self.url)
        force_authenticate(request, user=self.staff_user)  # Authenticated request with a staff user

        view = CustomerActivation.as_view()
        response = view(request, account_number=self.account.account_number)

        # Check if the response status is HTTP 200 OK or HTTP 404 Not Found
        if self.account.is_active:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("Customer status is already active", response.data['message'])
        else:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("Customer status changed successfully", response.data['message'])

    def test_already_active_customer_activation_view(self):
        self.account = accounts.objects.create(id=self.customer,account_number=123, is_active=True,balance=0.0)
        request = self.factory.put(self.url)
        force_authenticate(request, user=self.staff_user)  # Authenticated request with a staff user

        view = CustomerActivation.as_view()
        response = view(request, account_number=self.account.account_number)

        # Check if the response status is HTTP 200 OK or HTTP 404 Not Found
        if self.account.is_active:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("Customer status is already active", response.data['message'])
        else:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn("Customer status changed successfully", response.data['message'])

    def test_account_not_found(self):
        factory = APIRequestFactory()
        view = CustomerActivation.as_view()

        # Replace '12345' with an account number that does not exist
        request = factory.put('/api/activatecustomer/123/')

        force_authenticate(request, user=get_user_model().objects.create_user(username='testuser', password='testpassword',user_type = 'staff'))

        response = view(request, account_number='123')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data, {"message": "User does not exist"})

class CustomTokenObtainPairSerializerTestCase(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = CustomUser.objects.create(username='testuser', email='test@example.com', user_type='customer')
        self.user.set_password('password')
        self.user.save()

        # Create a related account
        self.account = accounts.objects.create(id=self.user, account_number='1234567890')

    def test_custom_token_generation(self):
        view = TokenObtainPairView.as_view()

        # Make a POST request to the token endpoint with test user credentials
        data = {'username': 'testuser', 'password': 'password'}
        response = self.client.post('login/', data, format='json')

        self.assertEqual(response.status_code, 200)
        token = response.data

        # Assertions to test the generated token
        self.assertEqual(token['name'], self.user.username)
        self.assertEqual(token['email'], self.user.email)
        self.assertEqual(token['account_number'], self.account.account_number)

        # Ensure 'user_id' is not in the token for a 'customer' type user
        self.assertFalse('user_id' in token)