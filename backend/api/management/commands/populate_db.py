from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile, Credit, Student, Reader, Cycle, Submission, Evidence, EarnedCredit
from datetime import datetime, timedelta
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Populate the database with initial data'
    fake = Faker()

    def handle(self, *args, **kwargs):
        # self.create_users()
        self.create_submissions()
        self.stdout.write(self.style.SUCCESS('Database populated successfully'))

    def create_users(self):
        for i in range(1, 271):
            first_name = self.fake.first_name()
            last_name = self.fake.last_name()
            graduation_year = self.fake.random_int(min=2025, max=2028)
            username = f'{str(graduation_year)[-2:]}{last_name[:3].lower()}{first_name[:3].lower()}'
            email = f'{username}@hawken.edu'
            user = User.objects.create_user(username=username, password='password')
            profile = Profile.objects.create(user=user, role=Profile.STUDENT_ROLE, first_name=first_name, last_name=last_name, email=email)
            Student.objects.create(profile=profile, graduation_year=graduation_year)

        credits = list(Credit.objects.all())
        for i in range(1, 31):
            first_name = self.fake.first_name()
            last_name = self.fake.last_name()
            username = f'{first_name}.{last_name}'
            email = f'{username}@hawken.edu'
            user = User.objects.create_user(username=username, password='password')
            profile = Profile.objects.create(user=user, role=Profile.READER_ROLE, first_name=first_name, last_name=last_name, email=email)
            reader = Reader.objects.create(profile=profile)
            comfortable_credits = random.sample(credits, random.randint(3, 7))
            reader.comfortable_credits.set(comfortable_credits)

    def create_submissions(self):
        students = Student.objects.all()
        cycles = Cycle.objects.all().order_by('submission_deadline')
        credits = list(Credit.objects.all())
        readers = Reader.objects.all()

        for student in students:
            earned_credits = set(EarnedCredit.objects.filter(student=student).values_list('credit', flat=True))
            for cycle in cycles:
                available_credits = [credit for credit in credits if credit.id not in earned_credits]
                num_submissions = min(random.randint(1, 8), len(available_credits))
                selected_credits = random.sample(available_credits, num_submissions)
                for credit in selected_credits:
                    reader = self.fake.random_element(elements=readers)
                    created_at = self.fake.date_time_between(start_date=cycle.submission_deadline - timedelta(days=90), end_date=cycle.submission_deadline - timedelta(days=2))
                    submitted_at = self.fake.date_time_between(start_date=created_at, end_date=cycle.submission_deadline)
                    if cycle.current:
                        status = Submission.UNREVIEWED
                        decision = Submission.TBD
                        feedback = None
                        completed_at = None
                    else:
                        status = Submission.COMPLETE
                        decision = random.choice([Submission.EARNED, Submission.NOT_EARNED])
                        feedback = self.fake.text()
                        completed_at = self.fake.date_time_between(start_date=cycle.submission_deadline + timedelta(days=3), end_date=cycle.submission_deadline + timedelta(days=7))
                    submission = Submission.objects.create(student=student, cycle=cycle, credit=credit, reader=reader, rationale=self.fake.text(), feedback=feedback, decision=decision, status=status, created_at=created_at, submitted_at=submitted_at, completed_at=completed_at)
                    self.create_evidences(submission)
                    if decision == Submission.EARNED:
                        EarnedCredit.objects.create(student=student, credit=credit, cycle=cycle, earned=completed_at)
                        earned_credits.add(credit.id)

    def create_evidences(self, submission):
        num_evidences = random.randint(2, 3)
        for _ in range(num_evidences):
            Evidence.objects.create(submission=submission, link=self.fake.url(), description=self.fake.text())

