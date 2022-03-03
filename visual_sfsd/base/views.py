from django.shortcuts import render, redirect, HttpResponse


def home(request):
    # return render(request, 'base/home/index.html')
    return HttpResponse("Home page")
