from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    STUDENT_ROLE = 'ST'
    READER_ROLE = 'RE'
    ADMIN_ROLE = 'AD'
    ROLES = (STUDENT_ROLE, 'Student'), (READER_ROLE, 'Reader'), (ADMIN_ROLE, 'Admin')

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    role = models.CharField(max_length=50, choices=ROLES, default=STUDENT_ROLE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        print("Saving profile:", self)
        super().save(*args, **kwargs)

class Credit(models.Model):
    number = models.CharField(max_length=5)
    name = models.CharField(max_length=50)
    simple_description = models.TextField()
    detailed_description = models.TextField()

    def save(self, *args, **kwargs):
        print("Saving credit:", self)
        super().save(*args, **kwargs)

class Student(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, primary_key=True)
    graduation_year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        print("Saving student:", self)
        super().save(*args, **kwargs)

class Reader(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, primary_key=True)
    comfortable_credits = models.ManyToManyField(Credit)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        print("Saving reader:", self)
        super().save(*args, **kwargs)

class Cycle(models.Model):
    season = models.CharField(max_length=50)
    year = models.IntegerField()
    submission_deadline = models.DateField()
    current = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        print("Saving cycle:", self)
        super().save(*args, **kwargs)

class Submission(models.Model):
    WRITING = 'WR'
    UNREVIEWED = 'UN'
    IN_PROGRESS = 'RE'
    COMPLETE = 'CO'
    STATUS = (WRITING, 'Writing'), (UNREVIEWED, 'Unreviewed'), (IN_PROGRESS, 'In Progress'), (COMPLETE, 'Complete')
    NOT_EARNED = 'NE'
    TBD = 'TB'
    EARNED = 'EA'
    DECISIONS = (NOT_EARNED, 'Not Earned'), (TBD, 'TBD'), (EARNED, 'Earned')

    student = models.ForeignKey(Student, on_delete=models.PROTECT)
    cycle = models.ForeignKey(Cycle, on_delete=models.CASCADE)
    credit = models.ForeignKey(Credit, on_delete=models.PROTECT)
    reader = models.ForeignKey(Reader, on_delete=models.PROTECT, null=True)
    rationale = models.TextField(default='')
    feedback = models.TextField(null=True)
    decision = models.CharField(max_length=50, choices=DECISIONS, default=TBD)
    status = models.CharField(max_length=50, choices=STATUS, default=WRITING)
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True)
    completed_at = models.DateTimeField(null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        print("Saving submission:", self)
        super().save(*args, **kwargs)

class Evidence(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
    link = models.URLField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        print("Saving evidence:", self)
        super().save(*args, **kwargs)

class EarnedCredit(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    credit = models.ForeignKey(Credit, on_delete=models.PROTECT)
    cycle = models.ForeignKey(Cycle, on_delete=models.PROTECT)
    earned = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        print("Saving earned credit:", self)
        super().save(*args, **kwargs)



