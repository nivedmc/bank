from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import bankuserSerializer,bankaccntSerializer,StaffUserSerializer,UpdateUserSerializer,ChangePasswordSerializer
from bankaccounts.models import accounts
from .models import CustomUser
import random
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from bankusers.permissions import IsManager
from rest_framework.authentication import TokenAuthentication
from bankaccounts.permissions import IsStaff
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from bankaccounts.models import accounts
from rest_framework.decorators import api_view
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import UpdateView
from django.contrib.auth.decorators import login_required


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def get_token(cls,user: CustomUser):
        token = super().get_token(user)
        token['name'] = user.username
        token['email'] = user.email
        token['user_type'] = user.user_type
        # token['account_number'] = user.accounts.account_number
        # token['user_id'] = user.id 
        if user.user_type=='customer':
            account= accounts.objects.get(id=user.id)
            token['account_number'] = account.account_number
            token['activity_status'] = account.is_active
        return token 

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10000



# class bankuserViews(generics.CreateAPIView):
#     # queryset = CustomUser.objects.all()
#     serializer_class = bankuserSerializer
#     def post(self, request):
#         import pdb;pdb.set_trace()
#         user_data = request.data
#         serializer=bankuserSerializer(data=user_data)
#         print(serializer)
#         user = CustomUser.objects.create_user(username=serializer.validated_data['username'], password=serializer.validated_data['password'])

#         if serializer.is_valid():
#             user = serializer.save()
#             serializer.save()
#             user_type = user_data.get('user_type')

#             if user_type == 'customer':
#                 acntno = random.randint(10000, 99999)
#                 account_data = {'id': user.id,'account_number':acntno,'balance': 0.0}
#                 account_serializer = bankaccntSerializer(data=account_data)

#                 if account_serializer.is_valid():
#                     account_serializer.save()
#                 else:
#                     user.delete()  # Rollback user creation if account creation fails
#                     return Response(account_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
#             return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
#         else:
#             return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        
class RegisterView(generics.CreateAPIView):
    serializer_class = bankuserSerializer
    def post(self, request):
        serializer = bankuserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # serializer.save()
        user = serializer.save()
        user_data=request.data
        user_type = user_data.get('user_type')

        if user_type == 'customer':
            acntno = random.randint(1000, 9999)*1000+user.id
            account_data = {'id': user.id,'account_number':acntno,'balance': 0.0}
            account_serializer = bankaccntSerializer(data=account_data)

            if account_serializer.is_valid():
                account_serializer.save()
        return Response(serializer.data)

class PendingAccountList(generics.ListAPIView):
    # permission_classes = [IsAuthenticated,IsStaff]
    # pagination_class = LargeResultsSetPagination
    queryset = accounts.objects.all().order_by('is_active')
    serializer_class = bankaccntSerializer


class StaffManagment(generics.ListAPIView):
    # authentication_classes=[TokenAuthentication]
    permission_classes = [IsAuthenticated,IsManager]
                          
    serializer_class = StaffUserSerializer

    def get_queryset(self):
        # Filter users by user_type = 'staff'
        return CustomUser.objects.filter(user_type='staff')

# class RemoveStaffUserView(RetrieveUpdateDestroyAPIView):
#     queryset=CustomUser.objects.filter(user_type='staff')
#     serializer_class = StaffUserSerializer

class CustomerActivation(APIView):
    permission_classes = [IsAuthenticated,IsStaff]
    def patch(self, request, account_number):
        try:
            account = accounts.objects.get(account_number=account_number)
        except accounts.DoesNotExist:
            return Response({"message": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if account.is_active == False:
            account.is_active = True # Toggle the active status
            account.save()
            return Response({"message": "Customer status changed successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Customer status is already active"})
@api_view(['DELETE']) 
def delete_staff(request,staffid):
    staff = get_object_or_404(CustomUser, id=staffid)
    print(staff)

    if request.method == 'POST':
        staff.delete()

    return Response({"message: succses"},status=status.HTTP_200_OK)



class UpdateProfileView(generics.UpdateAPIView):

    queryset = CustomUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateUserSerializer

class ChangePasswordView(generics.UpdateAPIView):

    queryset = CustomUser.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

class UserDetail(APIView):
    def get(self,request,id):
        customer= CustomUser.objects.get(id=id)
        context = {
            'first_name': customer.first_name,
            'last_name': customer.last_name,
            'username': customer.username,
            'email': customer.email,
            'mob_no': customer.mobile_no,
        }
        return Response(context)





        

