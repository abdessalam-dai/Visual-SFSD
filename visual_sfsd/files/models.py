from django.db import models
from django.contrib.auth.models import User
import json

TOF = 'TOF'
TnOF = 'TnOF'
LOF = 'LOF'
LnOF = 'LnOF'

FILE_TYPE_CHOICES = [
    (TOF, 'TOF'),
    (TnOF, 'TnOF'),
    (LOF, 'LOF'),
    (LnOF, 'LnOF'),
]

sequential = 'sequential'
indexed = 'indexed'
hashing = 'hashing'

FILE_ACCESS_CHOICES = [
    (sequential, 'sequential'),
    (indexed, 'indexed'),
    (hashing, 'hashing'),
]


class File(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    file_access = models.CharField(
        max_length=20,
        choices=FILE_ACCESS_CHOICES,
        default=sequential
    )
    file_type = models.CharField(
        max_length=5,
        choices=FILE_TYPE_CHOICES,
        default=TOF,
    )
    data = models.TextField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
