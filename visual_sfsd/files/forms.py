from django import forms
from django.forms import ModelForm
from .models import File


class CreateFileForm(ModelForm):
    name = forms.CharField(
        label="Title",
        required=True,
        max_length=100
    )
    nb_max_enregs = forms.IntegerField(
        label="Maximum number of enregs."
    )

    class Meta:
        model = File
        fields = '__all__'
        exclude = ['owner', 'date_created']
