from rest_framework import permissions

class IsCustomer(permissions.BasePermission):
    def has_permission(self, request, view):
        print(request)
        user = request.user
        return user and user.user_type == 'customer'