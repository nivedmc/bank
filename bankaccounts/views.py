from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from rest_framework import generics
from bankaccounts.models import CustomUser
from .models import accounts
from .serializers import bankaccntSerializer,userSerializer,accntdetailsSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from bankaccounts.permissions import IsStaff


# Create your views here.

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10000


class AccountList(generics.ListAPIView):
    permission_classes=[IsAuthenticated,IsStaff]
    pagination_class = LargeResultsSetPagination
    # queryset = accounts.objects.all()
    serializer_class = bankaccntSerializer
    # filter_backends = (filters.SearchFilter,)
    # search_fields = ('is_active')


class AccountDetail(APIView):
    def get(self,request,id):
        account= accounts.objects.get(id=id)
        customer= CustomUser.objects.get(id=id)
        context = {
            'user_id': id,
            'username': customer.username,
            'email': customer.email,
            'user_type': customer.user_type,
            'mob_no': customer.mobile_no,
            'account_number': account.account_number,
            'date_joined' : customer.date_joined,
            'is_active' : account.is_active,
        }
        return Response(context)


class ActivateAccountView(APIView):
    permission_classes=[IsAuthenticated,IsStaff]
    def post(self, request, account_number):
        try:
            account = accounts.objects.get(account_number=account_number)
        except accounts.DoesNotExist:
            return Response({"message": "Bank account does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Activate the account by setting is_active to True
        account.is_active = True
        account.save()

        return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)
    
class AccountDeactivate(APIView):
    permission_classes=[IsAuthenticated,IsStaff]
    def patch(self, request, account_number):
        try:
            account = accounts.objects.get(account_number=account_number)
        except accounts.DoesNotExist:
            return Response({"message": "Bank account does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Activate the account by setting is_active to True
        account.is_active = False
        account.save()

        return Response({"message": "Account deactivated successfully"}, status=status.HTTP_200_OK)
