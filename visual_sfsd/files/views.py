from django.shortcuts import render, redirect
from .models import File


def file_view(request, pk):
    file = File.objects.get(id=int(pk))

    context = {'file': file}

    return render(request, 'files/view_file/index.html', context)


def create_file(request):
    return render(request, 'files/create_file/index.html')
