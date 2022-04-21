from django.forms import ModelForm
from django.contrib.auth.models import User
from django import forms


class UserRegistrationForm(forms.ModelForm):
    input_classes = 'focus:outline-blue-500 block m-auto p-5 w-full rounded-full custom-shadow'
    first_name = forms.CharField(
        label='First Name',
        min_length=2,
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'First Name',
            'autofocus': ''
        }),
    )

    last_name = forms.CharField(
        label='Last Name',
        min_length=2,
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'Last Name'
        }),
    )

    email = forms.EmailField(
        label='Email',
        widget=forms.EmailInput(attrs={
            'class': input_classes,
            'placeholder': 'Email'
        }),
    )

    password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'class': input_classes,
            'placeholder': 'Password'
        }),
    )

    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'class': input_classes,
            'placeholder': 'Confirm Password'
        }),
    )

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email is already exists")
        return email

    def clean_password2(self):
        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError("Passwords don't match")
        return cd['password2']
