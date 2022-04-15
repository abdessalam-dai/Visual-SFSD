from django.shortcuts import render, redirect


def login(request):
    return render(request, 'accounts/login/index.html')


def register(request):
    return render(request, 'accounts/register/index.html')


def dashboard(request):
    return render(request, 'components/navbar/navbar_dashboard.html')