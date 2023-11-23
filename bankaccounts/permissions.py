from rest_framework import permissions

class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        print(request)
        user = request.user
        return user and user.user_type == 'staff'