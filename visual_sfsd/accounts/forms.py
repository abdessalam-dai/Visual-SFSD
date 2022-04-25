from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm


class UserRegistrationForm(ModelForm):
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


class UpdateProfileForm(ModelForm):
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super(UpdateProfileForm, self).__init__(*args, **kwargs)

    input_classes = 'focus:outline-blue-500 block m-auto p-5 w-full rounded-full custom-shadow'
    username = forms.CharField(
        label='Username',
        min_length=2,
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'Username',
        }),
    )

    first_name = forms.CharField(
        label='First Name',
        min_length=2,
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'First Name',
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

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')

    # # error here, it says username already exists
    # def clean_username(self):
    #     username = self.cleaned_data.get('username')
    #     if User.objects.exclude(pk=self.user.pk).filter(username=username).exists():
    #         raise forms.ValidationError("Username is not available")
    #     return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.exclude(pk=self.user.pk).filter(email=email).exists():
            raise forms.ValidationError("Email is already exists")
        return email
