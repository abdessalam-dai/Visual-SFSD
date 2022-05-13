from allauth.utils import set_form_field_order
from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm
from allauth.account.forms import LoginForm, SignupForm, ResetPasswordForm, ResetPasswordKeyForm, SetPasswordForm

from .models import Account

input_classes = 'focus:outline-blue-500 block m-auto p-5 w-full rounded-full custom-shadow'
remember_input_classes = 'w-4 h-4 cursor-pointer border border-red-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800'


class CustomResetPasswordForm(ResetPasswordForm):
    def __init__(self, *args, **kwargs):
        email_field = forms.EmailField(
            label='E-mail',
            widget=forms.EmailInput(attrs={
                'class': input_classes,
                'placeholder': 'Email address',
                'autofocus': ''
            }),
        )
        self.request = kwargs.pop("request", None)
        super(ResetPasswordForm, self).__init__(*args, **kwargs)
        self.fields["email"] = email_field


class CustomResetPasswordKeyForm(ResetPasswordKeyForm):
    def __init__(self, *args, **kwargs):
        password1 = forms.CharField(
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
        self.request = kwargs.pop("request", None)
        self.user = kwargs.pop("user", None)
        self.temp_key = kwargs.pop("temp_key", None)
        super(ResetPasswordKeyForm, self).__init__(*args, **kwargs)
        self.fields["password1"] = password1
        self.fields["password2"] = password2
        set_form_field_order(self, [
            "password1",
            "password2",
        ])


class CustomLoginForm(LoginForm):
    def __init__(self, *args, **kwargs):
        login_field = forms.EmailField(
            label='E-mail',
            widget=forms.EmailInput(attrs={
                'class': input_classes,
                'placeholder': 'Email address',
                'autofocus': ''
            }),
        )
        password_field = forms.CharField(
            label='Password',
            widget=forms.PasswordInput(attrs={
                'class': input_classes,
                'placeholder': 'Password',
            }),
        )
        remember_field = forms.BooleanField(
            label="Remember Me",
            widget=forms.CheckboxInput(attrs={
                'class': remember_input_classes,
                'checked': 'checked'
            })
        )
        self.request = kwargs.pop("request", None)
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields["login"] = login_field
        self.fields["password"] = password_field
        self.fields["remember"] = remember_field
        set_form_field_order(self, ["login", "password", "remember"])


class CustomSignUpForm(SignupForm):
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

    def __init__(self, *args, **kwargs):
        username = forms.CharField(
            label='Username',
            min_length=2,
            max_length=150,
            widget=forms.TextInput(attrs={
                'class': input_classes,
                'placeholder': 'Username',
                'autofocus': ''
            }),
        )

        email = forms.EmailField(
            label='Email',
            widget=forms.EmailInput(attrs={
                'class': input_classes,
                'placeholder': 'Email'
            }),
        )

        password1 = forms.CharField(
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
        self.request = kwargs.pop("request", None)
        super(SignupForm, self).__init__(*args, **kwargs)
        self.fields["email"] = email
        self.fields["username"] = username
        self.fields["password1"] = password1
        self.fields["password2"] = password2
        set_form_field_order(self, [
            "email",
            "email2",  # ignored when not present
            "username",
            "password1",
            "password2",  # ignored when not present
        ])

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()


class UserRegistrationForm(ModelForm):
    input_classes = 'focus:outline-blue-500 block m-auto p-5 w-full rounded-full custom-shadow'
    username = forms.CharField(
        label='Username',
        min_length=2,
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': input_classes,
            'placeholder': 'Username',
            'autofocus': ''
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
        fields = ('username', 'first_name', 'last_name', 'email')

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

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.exclude(pk=self.user.pk).filter(email=email).exists():
            raise forms.ValidationError("Email is already exists")
        return email
