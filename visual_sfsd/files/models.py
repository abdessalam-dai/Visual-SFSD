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


class File(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    file_type = models.CharField(
        max_length=5,
        choices=FILE_TYPE_CHOICES,
        default=TOF,
    )
    data = models.TextField(null=True, blank=True)
    nb_max_enregs = models.PositiveIntegerField(default=10)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
