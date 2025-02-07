import time
import json
from django.db import transaction
from django.core.cache import cache
from django.contrib.auth.models import User
from rest_framework import generics, serializers, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from .serializers import UserSerializer, ProfileSerializer, CreditSerializer, StudentSerializer, ReaderSerializer, CycleSerializer, SubmissionSerializer, EvidenceSerializer, EarnedCreditSerializer
from .models import Profile, Credit, Student, Reader, Cycle, Submission, Evidence, EarnedCredit
from .permissions import IsStudentOrReadOnly

class CreateUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        user = serializer.save()
        profile_data = self.request.data.get('profile', {})
        
        profile = Profile.objects.create(
            user=user,
            **{k: v for k, v in profile_data.items() if k in ['role', 'first_name', 'last_name', 'email']}
        )
        
        if profile.role == Profile.STUDENT_ROLE:
            Student.objects.create(
                profile=profile,
                graduation_year=self.request.data.get('graduation_year')
            )
        elif profile.role == Profile.READER_ROLE:
            Reader.objects.create(profile=profile)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = self.queryset.get(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

class CreditViewSet(viewsets.ModelViewSet):
    queryset = Credit.objects.all()
    serializer_class = CreditSerializer
    permission_classes = [IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

class ReaderViewSet(viewsets.ModelViewSet):
    queryset = Reader.objects.all()
    serializer_class = ReaderSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def assigned_submissions(self, request):
        cache_key = f'assigned_submissions_{request.user.id}'
        if cached := cache.get(cache_key):
            return Response(cached)
        
        try:
            print("Fetching current cycle")
            current_cycle = Cycle.objects.get(current=True)
            print(f"Current cycle: {current_cycle}")

            print("Fetching reader")
            reader = Reader.objects.select_related('profile').prefetch_related('comfortable_credits').get(profile__user=request.user)
            print(f"Reader: {reader}")

            print("Fetching submissions")
            submissions = Submission.objects.filter(
                reader=reader, 
                cycle=current_cycle
            ).select_related(
                'student__profile',
                'cycle',
                'credit',
                'reader__profile'
            ).prefetch_related('evidence_set')
            print(f"Submissions: {submissions}")

            serializer = SubmissionSerializer(submissions, many=True)
            response_data = serializer.data
            cache.set(cache_key, response_data, timeout=300)
            return Response(response_data)
        
        except Cycle.DoesNotExist:
            print("No current cycle found")
            return JsonResponse({"detail": "No current cycle found."}, status=404)
        except Reader.DoesNotExist:
            print("Reader not found")
            return JsonResponse({"detail": "Reader not found."}, status=404)
        except Exception as e:
            print(f"Error fetching assigned submissions: {e}")
            return JsonResponse({"detail": "Internal server error."}, status=500)

class CycleViewSet(viewsets.ModelViewSet):
    queryset = Cycle.objects.all()
    serializer_class = CycleSerializer
    permission_classes = [IsAuthenticated]

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated, IsStudentOrReadOnly]
    
    def perform_create(self, serializer):
        current_cycle = Cycle.objects.get(current=True)
        serializer.save(cycle=current_cycle)

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer
    permission_classes = [IsAuthenticated]

class EarnedCreditViewSet(viewsets.ModelViewSet):
    queryset = EarnedCredit.objects.all()
    serializer_class = EarnedCreditSerializer
    permission_classes = [IsAuthenticated]

