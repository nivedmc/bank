from django.urls import path
from .views import TransactionCreateView
from .views import export_transactions_csv

urlpatterns = [
    # path('transactions/', TransactionListCreateView.as_view(), name='transaction-list'),
    path('transactions/', TransactionCreateView.as_view(), name='transaction-detail'),
    # path('transactions1/', TransactionCreateView.as_view(), name='transaction-create'),
    path('export-transactions/', export_transactions_csv, name='export_transactions_csv'),
    # path('export-transactions1/', export_trans_csv, name='export_trans_csv'),
]
