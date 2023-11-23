from django.urls import path
from .views import RegisterView,PendingAccountList,StaffManagment,CustomerActivation,CustomTokenObtainPairView,delete_staff,UpdateProfileView,ChangePasswordView,UserDetail
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt import views as jwt_views



urlpatterns = [
    # path('userreg/', views.members, name='userreg'),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('userregistration/', RegisterView.as_view(),name='userregistration'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('pendingcustomers/', PendingAccountList.as_view(),name = 'pendingcustomers'),
    path('activatecustomer/<int:account_number>/', CustomerActivation.as_view(),name = 'customeractivation'),
    path('staffmanagement/',StaffManagment.as_view(),name='staffmanage'),
    path('removestaff/<int:staffid>/',delete_staff),
    path('updateprofile/<int:pk>/',UpdateProfileView.as_view()),
    path('profile/<int:id>/',UserDetail.as_view()),
    path('change_password/<int:pk>/', ChangePasswordView.as_view(), name='auth_change_password'),
    # path('removestaff/',RemoveStaffUserView.as_view(),name='removestaff')
    # path('api/register/', RegisterView.as_view(), name="sign_up"),
]
