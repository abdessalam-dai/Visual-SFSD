from django.db import models
from django.contrib.auth.models import User

student = 'student'
teacher = 'teacher'

ROLE_CHOICES = [
    (student, 'Student'),
    (teacher, 'Teacher'),
]


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    new_user = models.BooleanField(default=True)
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=student
    )

    def __str__(self):
        return self.user.username

    def is_teacher(self):
        return self.role == 'teacher'
