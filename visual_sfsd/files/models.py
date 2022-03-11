from django.db import models
from django.contrib.auth.models import User


class File(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    nb_max_enregs = models.PositiveIntegerField(default=10)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Block(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    index = models.IntegerField()
    next_block_index = models.IntegerField(default=-1)
    nb = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.file.name}, {self.index}'


class Enreg(models.Model):
    block = models.ForeignKey(Block, on_delete=models.CASCADE)
    index = models.IntegerField()
    key = models.PositiveIntegerField()
    field1 = models.CharField(max_length=100, null=True, blank=True)
    field2 = models.CharField(max_length=100, null=True, blank=True)
    removed = models.BooleanField(default=False)



""" 

{
name: 
nbMaxEnreg:
}

"""
