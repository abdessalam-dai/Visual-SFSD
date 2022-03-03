from django.shortcuts import render, redirect


def login(request):
    return render(request, 'accounts/login/index.html')


def register(request):
    return
