from django.db import models
from django.contrib.auth.models import User
import json
from datetime import datetime

TOF = 'TOF'
TnOF = 'TnOF'
LOF = 'LOF'
LnOF = 'LnOF'
clustered = 'clustered'
not_clustered = 'not_clustered'
essai_linear = 'essai_linear'


FILE_TYPE_CHOICES = [
    (TOF, 'TOF'),
    (TnOF, 'TnOF'),
    (LOF, 'LOF'),
    (LnOF, 'LnOF'),
    (clustered, 'Clustered'),
    (not_clustered, 'Not Clustered'),
    (essai_linear, 'Essai Linear'),
]

sequential = 'sequential'
indexed = 'indexed'
hashing = 'hashing'

FILE_ACCESS_CHOICES = [
    (sequential, 'Sequential'),
    (indexed, 'Indexed'),
    (hashing, 'Hashing'),
]


class File(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    file_access = models.CharField(
        max_length=30,
        choices=FILE_ACCESS_CHOICES,
        default=sequential
    )
    file_type = models.CharField(
        max_length=30,
        choices=FILE_TYPE_CHOICES,
        default=TOF,
    )
    is_public = models.BooleanField(default=True)
    data = models.TextField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    # clone file by other user (user)
    def clone(self, user):
        file = self
        file.owner = user
        file.date_created = datetime.now()
        file.pk = None
        file._state.adding = True
        file.save()
        return file

    # check if the file is owner by user
    def is_owned_by(self, user):
        return self.owner == user
