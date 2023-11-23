from django.urls import path
from .views import AccountDetail,AccountList,ActivateAccountView,AccountDeactivate
urlpatterns = [
    path('accounts/', AccountList.as_view(), name='account-list'),
    path('accounts/<int:id>/', AccountDetail.as_view(), name='account-detail'),
    path('accounts/<int:account_number>/activate/', ActivateAccountView.as_view(), name='activate-account'),
    path('accounts/<int:account_number>/deactivate/', AccountDeactivate.as_view(), name='deactivate-account')
]
