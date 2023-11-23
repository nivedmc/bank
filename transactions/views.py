from rest_framework.views import APIView
from .models import details
from .serializer import TransactionSerializer,accountSerializer
from bankaccounts.models import accounts
from rest_framework import status
from rest_framework.response import Response
from decimal import Decimal
import csv
from django.http import HttpResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import AccessToken
from .permissions import IsCustomer
from django.db import transaction



class TransactionCreateView(APIView):
    renderer_classes = [StaticHTMLRenderer]
    permission_classes = [IsAuthenticated,IsCustomer]

    @transaction.atomic
    def post(self, request):
        authorization_header = request.headers.get('Authorization')
        token= authorization_header.split('Bearer ')[1].strip()
        access_token = AccessToken(token)
        payload = access_token.payload
        account_number=payload.get('account_number')
        # userid=request.user.id
        # Get the account based on the account number provided in the URL
        try:
            # account = accounts.objects.get(id=userid)           
            account = accounts.objects.get(account_number=account_number)
        except accounts.DoesNotExist:
            return Response({"message": "Bank account does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Get the transaction details from the request data
        if account.is_active == True:
            transaction_type = request.data.get("transaction_type")
            amount = Decimal(request.data.get("amount", 0.0))

            if transaction_type not in ('deposit', 'withdrawal'):
                return Response({"message": "Invalid transaction type"}, status=status.HTTP_400_BAD_REQUEST)

            if transaction_type == 'deposit':
                account.balance += amount
            elif transaction_type == 'withdrawal':
                if amount > account.balance:
                    return Response({"message": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)
                account.balance -= amount
            # crntbalance=account.balance

            account.save()

            # Create a Transaction instance without using a serializer
            transaction = details.objects.create(
                account_number=account,
                transaction_type=transaction_type,
                amount=amount,
                currentbalance=account.balance
            )

            return Response({"message": "Transaction successful"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "the bank account is not active"})
    
    # def get(self, request):
    #     try:
    #         userid=request.user.id
    #         account = accounts.objects.get(id=userid)
    #         account_number=account.account_number
    #         valid_account_number = accounts.objects.get(id=userid)
    #     except accounts.DoesNotExist:
    #         return Response({"message": "Invalid account number"}, status=status.HTTP_404_NOT_FOUND)
        
    #     response = HttpResponse(content_type='text/csv')
    #     response['Content-Disposition'] = f'attachment; filename="transactions_{account_number}.csv"' 

    #     writer = csv.writer(response)
    #     writer.writerow(['Date', 'Amount', 'Transaction Type'])

    #     activeaccounts = accounts.objects.filter(is_active=True)

    #     has_transactions = False

    #     if account in activeaccounts:
    #         try:
    #             transactions = details.objects.filter(account_number=account)
    #             if transactions.exists():
    #                 for transaction in transactions:
    #                     writer.writerow([transaction.transaction_date, transaction.transaction_type, transaction.amount,transaction.currentbalance])
    #                     has_transactions = True
    #         except details.DoesNotExist:
    #             # Account number does not exist
    #             pass

    #     if not has_transactions:
    #         # No transactions found, delete the CSV response
    #         response = HttpResponse(content_type='text/plain')
    #         response['Content-Disposition'] = f'attachment; filename="transactions_{account_number}.csv"' 
    #         response.write("No transactions found for any valid bank accounts.")
    #         return response

    #     return response
    
@api_view(['GET']) 
def export_transactions_csv(request):
    try:
        userid=request.user.id
        account = accounts.objects.get(id=userid)
        account_number=account.account_number
        valid_account_number = accounts.objects.get(id=userid)
    except accounts.DoesNotExist:
         return Response({"message": "Invalid account number"}, status=status.HTTP_404_NOT_FOUND)
    transactions = details.objects.filter(account_number=valid_account_number)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="transactions_{account_number}.csv"'  
    writer = csv.writer(response)
    writer.writerow(['Transaction Date', 'Transaction Type', 'Amount','balance']) 
    for transaction in transactions:
        writer.writerow([transaction.transaction_date, transaction.transaction_type, transaction.amount,transaction.currentbalance])
    return response


# def export_trans_csv(request):
#     try:
#         userid=request.user.id
#         account = accounts.objects.get(id=userid)
#         account_number=account.account_number
#         valid_account_number = accounts.objects.get(id=userid)
#     except accounts.DoesNotExist:
#         return Response({"message": "Invalid account number"}, status=status.HTTP_404_NOT_FOUND)
        
#     response = HttpResponse(content_type='text/csv')
#     response['Content-Disposition'] = f'attachment; filename="transactions_{account_number}.csv"' 

#     writer = csv.writer(response)
#     writer.writerow(['Date', 'Amount', 'Transaction Type'])

#     activeaccounts = accounts.objects.filter(is_active=True)

#     has_transactions = False   
#     if account in activeaccounts:
#             try:
#                 transactions = details.objects.filter(account_number=account)
#                 if transactions.exists():
#                     for transaction in transactions:
#                         writer.writerow([transaction.transaction_date, transaction.transaction_type, transaction.amount,transaction.currentbalance])
#                         has_transactions = True
#             except details.DoesNotExist:
#                 # Account number does not exist
#                 pass
#             if not has_transactions:
#             # No transactions found, delete the CSV response
#                 response = HttpResponse(content_type='text/plain')
#                 response['Content-Disposition'] = f'attachment; filename="transactions_{account_number}.csv"' 
#                 response.write("No transactions found for any valid bank accounts.")
#                 return response

#     return response
   
