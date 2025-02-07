from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Credit, Student, Reader, Cycle, Submission, Evidence, EarnedCredit

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        print("Creating user with data:", validated_data)
        user = User.objects.create_user(**validated_data)
        print("User created:", user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'role', 'first_name', 'last_name', 'email', 'created_at', 'updated_at']

class CreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = ['number', 'name', 'simple_description', 'detailed_description']

class StudentSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = Student
        fields = ['profile', 'graduation_year', 'created_at', 'updated_at']

class ReaderSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    comfortable_credits = CreditSerializer(many=True)

    class Meta:
        model = Reader
        fields = ['profile', 'comfortable_credits', 'created_at', 'updated_at']

class CycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cycle
        fields = ['season', 'year', 'submission_deadline', 'current']

class NestedProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name']

class NestedStudentSerializer(serializers.ModelSerializer):
    profile = NestedProfileSerializer()

    class Meta:
        model = Student
        fields = ['profile']

class NestedCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cycle
        fields = ['season', 'year']

class NestedCreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = ['number', 'name']

class SubmissionSerializer(serializers.ModelSerializer):
    student = NestedStudentSerializer()
    cycle = NestedCycleSerializer()
    credit = NestedCreditSerializer()
    reader = ReaderSerializer()

    class Meta:
        model = Submission
        fields = ['id', 'student', 'cycle', 'credit', 'reader', 'rationale', 'feedback', 'decision', 'status', 'created_at', 'submitted_at', 'completed_at', 'updated_at']

class EvidenceSerializer(serializers.ModelSerializer):
    submission = SubmissionSerializer()

    class Meta:
        model = Evidence
        fields = ['submission', 'link', 'description', 'created_at', 'updated_at']

class EarnedCreditSerializer(serializers.ModelSerializer):
    student = StudentSerializer()
    credit = NestedCreditSerializer()
    cycle = NestedCycleSerializer()

    class Meta:
        model = EarnedCredit
        fields = ['student', 'credit', 'cycle', 'earned']




