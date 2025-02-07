from rest_framework.permissions import BasePermission
from .models import Profile

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return obj.user == request.user

class IsStudentOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        if request.user and request.user.is_authenticated:
            try:
                profile = Profile.objects.get(user=request.user)
                return profile.role == Profile.STUDENT_ROLE
            except Profile.DoesNotExist:
                return False
        return False
