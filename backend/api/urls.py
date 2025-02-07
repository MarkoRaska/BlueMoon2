from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet)
router.register(r'credits', views.CreditViewSet)
router.register(r'students', views.StudentViewSet)
router.register(r'readers', views.ReaderViewSet)
router.register(r'cycles', views.CycleViewSet)
router.register(r'submissions', views.SubmissionViewSet)
router.register(r'evidences', views.EvidenceViewSet)
router.register(r'earnedcredits', views.EarnedCreditViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/', views.CreateUserView.as_view(), name='user-create'),
    path('profiles/me/', views.ProfileViewSet.as_view({'get': 'me'}), name='profile-me'),
    path('readers/assigned_submissions/', views.ReaderViewSet.as_view({'get': 'assigned_submissions'}), name='reader-assigned-submissions'),
]