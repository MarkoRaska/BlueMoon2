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
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

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
            current_cycle = Cycle.objects.get(current=True)
            reader = Reader.objects.select_related('profile').prefetch_related('comfortable_credits').get(profile__user=request.user)
            submissions = Submission.objects.filter(
                reader=reader, 
                cycle=current_cycle
            ).select_related(
                'student__profile',
                'cycle',
                'credit',
                'reader__profile'
            ).prefetch_related('evidence_set').order_by('credit__number', 'student__profile__last_name')
            serializer = SubmissionSerializer(submissions, many=True)
            response_data = serializer.data
            cache.set(cache_key, response_data, timeout=300)
            return Response(response_data)
        
        except Cycle.DoesNotExist:
            return JsonResponse({"detail": "No current cycle found."}, status=404)
        except Reader.DoesNotExist:
            return JsonResponse({"detail": "Reader not found."}, status=404)
        except Exception as e:
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

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

class SaveFeedbackView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        submission_id = request.data.get("submissionId")
        feedback = request.data.get("feedback")

        try:
            submission = Submission.objects.get(id=submission_id)
            submission.feedback = feedback
            submission.save()

            cache_key = f'assigned_submissions_{submission.reader.profile.user.id}'
            cached_data = cache.get(cache_key)
            if cached_data:
                for cached_submission in cached_data:
                    if cached_submission['id'] == submission_id:
                        cached_submission['feedback'] = feedback
                cache.set(cache_key, cached_data, timeout=300)

            return Response({"detail": "Feedback saved successfully."}, status=200)
        except Submission.DoesNotExist:
            return Response({"detail": "Submission not found."}, status=404)
        except Exception as e:
            return Response({"detail": "Internal server error."}, status=500)

class SaveNotesView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        submission_id = request.data.get("submissionId")
        notes = request.data.get("notes")

        if not submission_id:
            return Response({"detail": "Submission ID is required."}, status=400)

        try:
            submission = Submission.objects.get(id=submission_id)
            submission.notes = notes
            submission.save()

            cache_key = f'assigned_submissions_{submission.reader.profile.user.id}'
            cached_data = cache.get(cache_key)
            if cached_data:
                for cached_submission in cached_data:
                    if cached_submission['id'] == submission_id:
                        cached_submission['notes'] = notes
                cache.set(cache_key, cached_data, timeout=300)

            return Response({"detail": "Notes saved successfully."}, status=200)
        except Submission.DoesNotExist:
            return Response({"detail": "Submission not found."}, status=404)
        except Exception as e:
            return Response({"detail": "Internal server error."}, status=500)

class SaveDecisionView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        submission_id = request.data.get("submissionId")
        decision = request.data.get("decision")

        if not submission_id:
            return Response({"detail": "Submission ID is required."}, status=400)

        try:
            submission = Submission.objects.get(id=submission_id)
            submission.decision = decision
            submission.save()

            cache_key = f'assigned_submissions_{submission.reader.profile.user.id}'
            cached_data = cache.get(cache_key)
            if cached_data:
                for cached_submission in cached_data:
                    if cached_submission['id'] == submission_id:
                        cached_submission['decision'] = decision
                cache.set(cache_key, cached_data, timeout=300)

            return Response({"detail": "Decision saved successfully."}, status=200)
        except Submission.DoesNotExist:
            return Response({"detail": "Submission not found."}, status=404)
        except Exception as e:
            return Response({"detail": "Internal server error."}, status=500)

