import uuid
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    class Role(models.TextChoices):
        STUDENT = 'ST', 'Student'
        READER = 'RE', 'Reader'
        ADMIN = 'AD', 'Admin'

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, db_index=True)
    role = models.CharField(max_length=2, choices=Role.choices, default=Role.STUDENT)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['role']),
        ]

class Credit(models.Model):
    number = models.CharField(max_length=5)
    name = models.CharField(max_length=50)
    simple_description = models.TextField()
    detailed_description = models.TextField()

    class Meta:
        ordering = ['number']

class Student(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, primary_key=True)
    graduation_year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['graduation_year']),
        ]

class ReaderCreditComfort(models.Model):
    class ComfortLevel(models.IntegerChoices):
        LOW = 1, 'Low'
        MEDIUM = 2, 'Medium'
        HIGH = 3, 'High'

    reader = models.ForeignKey('Reader', on_delete=models.CASCADE)
    credit = models.ForeignKey(Credit, on_delete=models.CASCADE)
    comfort_level = models.IntegerField(choices=ComfortLevel.choices)

    class Meta:
        unique_together = ['reader', 'credit']

class Reader(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, primary_key=True)
    comfortable_credits = models.ManyToManyField(Credit, through=ReaderCreditComfort)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Cycle(models.Model):
    season = models.CharField(max_length=50)
    year = models.IntegerField()
    submission_deadline = models.DateField()
    current = models.BooleanField(default=False)

    class Meta:
        unique_together = ['season', 'year']
        ordering = ['-year', 'season']

class Submission(models.Model):
    class Status(models.TextChoices):
        WRITING = 'WR', 'Writing'
        UNREVIEWED = 'UN', 'Unreviewed'
        IN_PROGRESS = 'RE', 'In Progress'
        COMPLETE = 'CO', 'Complete'

    class Decision(models.TextChoices):
        NOT_EARNED = 'NE', 'Not Earned'
        TBD = 'TB', 'TBD'
        EARNED = 'EA', 'Earned'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.PROTECT, db_index=True)
    cycle = models.ForeignKey(Cycle, on_delete=models.CASCADE, db_index=True)
    credit = models.ForeignKey(Credit, on_delete=models.PROTECT, db_index=True)
    reader = models.ForeignKey(Reader, on_delete=models.PROTECT, null=True, db_index=True)
    rationale = models.TextField(default='')
    feedback = models.TextField(null=True)
    decision = models.CharField(max_length=2, choices=Decision.choices, default=Decision.TBD)
    status = models.CharField(max_length=2, choices=Status.choices, default=Status.WRITING)
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True)
    completed_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'decision']),
        ]

class Evidence(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='evidences')
    link = models.URLField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class EarnedCredit(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    credit = models.ForeignKey(Credit, on_delete=models.PROTECT)
    cycle = models.ForeignKey(Cycle, on_delete=models.PROTECT)
    earned = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'credit', 'cycle']
        ordering = ['-earned']

