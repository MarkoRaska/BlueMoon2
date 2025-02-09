from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Credit, Student, Reader, Cycle, Submission, Evidence, EarnedCredit

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = ['user_id', 'role', 'first_name', 'last_name', 'email', 'created_at', 'updated_at']

class CreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = ['number', 'name', 'simple_description', 'detailed_description']

class StudentSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ['profile', 'graduation_year', 'created_at', 'updated_at']
        depth = 1

class ReaderSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    comfortable_credits = serializers.SerializerMethodField()

    class Meta:
        model = Reader
        fields = ['profile', 'comfortable_credits', 'created_at', 'updated_at']

    def get_profile(self, obj):
        return {
            'first_name': obj.profile.first_name,
            'last_name': obj.profile.last_name,
            'email': obj.profile.email
        }

    def get_comfortable_credits(self, obj):
        return [{'number': credit.number, 'name': credit.name} for credit in obj.comfortable_credits.all()]

class CycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cycle
        fields = ['season', 'year', 'submission_deadline', 'current']

class SubmissionSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    cycle = serializers.SerializerMethodField()
    credit = serializers.SerializerMethodField()
    reader = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = ['id', 'student', 'cycle', 'credit', 'reader', 'rationale', 'feedback', 'decision', 'status', 'created_at', 'submitted_at', 'completed_at', 'updated_at', 'notes']

    def get_student(self, obj):
        return {
            'first_name': obj.student.profile.first_name,
            'last_name': obj.student.profile.last_name
        }

    def get_cycle(self, obj):
        return {
            'season': obj.cycle.season,
            'year': obj.cycle.year
        }

    def get_credit(self, obj):
        return {
            'number': obj.credit.number,
            'name': obj.credit.name
        }

    def get_reader(self, obj):
        if obj.reader:
            return {
                'first_name': obj.reader.profile.first_name,
                'last_name': obj.reader.profile.last_name
            }
        return None

class EvidenceSerializer(serializers.ModelSerializer):
    submission_id = serializers.UUIDField(source='submission.id')

    class Meta:
        model = Evidence
        fields = ['submission_id', 'link', 'description', 'created_at', 'updated_at']

class EarnedCreditSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    credit = serializers.SerializerMethodField()
    cycle = serializers.SerializerMethodField()

    class Meta:
        model = EarnedCredit
        fields = ['student', 'credit', 'cycle', 'earned']

    def get_student(self, obj):
        return {
            'first_name': obj.student.profile.first_name,
            'last_name': obj.student.profile.last_name
        }

    def get_credit(self, obj):
        return {
            'number': obj.credit.number,
            'name': obj.credit.name
        }

    def get_cycle(self, obj):
        return {
            'season': obj.cycle.season,
            'year': obj.cycle.year
        }

