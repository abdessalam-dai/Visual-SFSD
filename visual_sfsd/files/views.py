from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import Http404
from .models import File
from .forms import CreateFileForm


def file_view(request, pk):
    try:
        file = File.objects.get(id=int(pk))

        context = {
            'file': file
        }
        return render(request, 'files/view_file/index.html', context)
    except:
        raise Http404


def create_file(request):
    # form =
    return render(request, 'files/create_file/index.html')


# def request_download_page(request):
#     form = RequestDownloadForm()
#
#     if request.method == 'POST':
#         form = RequestDownloadForm(request.POST)
#         if form.is_valid():
#             category = request.POST.get('category')
#
#             download = form.save(commit=False)
#             download.owner = request.user
#             download.save()
#
#             if category in ('COURS', 'MOVTV'):
#                 video_quality = request.POST.get('video_quality')
#
#                 video = Video(download=download, quality=video_quality)
#                 video.save()
#
#             messages.success(request, 'Form submission successful')
#             return redirect('download', pk=download.id)
#
#     context = {'form': form}
#     return render(request, 'base/request_download.html', context)
#

