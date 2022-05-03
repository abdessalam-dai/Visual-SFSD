from django.db import models


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} : {self.subject}'
