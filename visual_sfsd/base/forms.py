from django import forms
from django.forms import ModelForm
from .models import Contact


class ContactForm(ModelForm):
    input_classes = 'focus:outline-blue-500 block m-auto p-5 w-full rounded-full custom-shadow'
    name = forms.CharField(
        label='Full Name',
        min_length=2,
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'Full Name',
            'autofocus': ''
        }),
    )

    subject = forms.CharField(
        label='Subject',
        min_length=2,
        max_length=255,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'Subject',
        }),
    )

    message = forms.CharField(
        label='Message',
        widget=forms.Textarea(attrs={
            'class': 'focus:outline-blue-500 resize-none block m-auto mb-8 p-5 w-full rounded-3xl custom-shadow',
            'placeholder': 'Message',
            'rows': '4',
        }),
    )

    email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(attrs={
            'class': input_classes,
            'placeholder': 'Email'
        }),
    )

    class Meta:
        model = Contact
        fields = '__all__'
        exclude = ['date_created']
