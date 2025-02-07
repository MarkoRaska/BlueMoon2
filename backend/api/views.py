import time
import json
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, serializers, viewsets
from .serializers import UserSerializer, ProfileSerializer, CreditSerializer, StudentSerializer, ReaderSerializer, CycleSerializer, SubmissionSerializer, EvidenceSerializer, EarnedCreditSerializer
from .models import Profile, Credit, Student, Reader, Cycle, Submission, Evidence, EarnedCredit
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsStudentOrReadOnly

class CreateUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        print("Creating user with data:", serializer.validated_data)
        user = serializer.save()
        profile_data = self.request.data.get('profile', {})
        print("Profile data:", profile_data)
        profile_data['user'] = user.id
        profile_serializer = ProfileSerializer(data=profile_data)
        if profile_serializer.is_valid():
            profile = profile_serializer.save(user=user)
            print("Profile created:", profile)
            if profile.role == Profile.STUDENT_ROLE:
                graduation_year = self.request.data.get('graduation_year')
                Student.objects.create(profile=profile, graduation_year=graduation_year)
                print("Student profile created with graduation year:", graduation_year)
            elif profile.role == Profile.READER_ROLE:
                Reader.objects.create(profile=profile)
                print("Reader profile created")
        else:
            user.delete()
            print("Profile creation failed:", profile_serializer.errors)
            raise serializers.ValidationError(profile_serializer.errors)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = self.queryset.get(user=request.user)
        serializer = self.get_serializer(profile)
        print("Returning profile for current user:", serializer.data)
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
        start_time = time.time()
        current_cycle = Cycle.objects.filter(current=True).first()
        if not current_cycle:
            return Response({"detail": "No current cycle found."}, status=404)
        
        reader = self.queryset.filter(profile__user=request.user).first()
        if not reader:
            return Response({"detail": "Reader not found."}, status=404)
        
        query_start_time = time.time()
        submissions = Submission.objects.filter(reader=reader, cycle=current_cycle).select_related('student__profile', 'cycle', 'credit')
        query_end_time = time.time()
        
        serializer_start_time = time.time()
        serializer = SubmissionSerializer(submissions, many=True)
        serializer_end_time = time.time()
        
        response_data = serializer.data
        response_size = len(json.dumps(response_data))
        
        end_time = time.time()
        print(f"Time taken to fetch assigned submissions: {end_time - start_time} seconds")
        print(f"Time taken for query: {query_end_time - query_start_time} seconds")
        print(f"Time taken for serialization: {serializer_end_time - serializer_start_time} seconds")
        print(f"Response size: {response_size} bytes")
        return Response(response_data)

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
        print("Current cycle:", current_cycle)
        print("Request data:", self.request.data)
        if serializer.is_valid():
            submission = serializer.save(cycle=current_cycle)
            print("Submission created:", submission)
        else:
            print("Submission creation failed:", serializer.errors)
            raise serializers.ValidationError(serializer.errors)

    def create(self, request, *args, **kwargs):
        print("Create method called with data:", request.data)
        response = super().create(request, *args, **kwargs)
        print("Response status code:", response.status_code)
        print("Response data:", response.data)
        return response

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer
    permission_classes = [IsAuthenticated]

class EarnedCreditViewSet(viewsets.ModelViewSet):
    queryset = EarnedCredit.objects.all()
    serializer_class = EarnedCreditSerializer
    permission_classes = [IsAuthenticated]








