from django.shortcuts import render, redirect, HttpResponse
from django.http import Http404


def home(request):
    return render(request, 'base/home/index.html')


def page_not_found_view(request, exception):
    return HttpResponse("404")
