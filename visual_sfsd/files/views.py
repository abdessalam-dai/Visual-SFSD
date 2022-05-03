from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404, JsonResponse
from django.views.decorators.http import require_POST
from .models import File
from .forms import CreateFileForm
import json


@login_required
def view_file(request, pk):
    try:
        file = File.objects.get(id=int(pk))

        if file.is_owned_by(request.user) or file.is_public:
            context = {
                'file': file,
                'dataPy': json.loads(file.data),  # this is used for displaying in django templates
                'data': file.data,  # this is used for JavaScript
            }

            return render(request, 'files/view_file/index.html', context)
        else:
            pass
    except:
        pass

    raise Http404


@login_required
@require_POST
def save_file(request, pk):
    file_data = request.POST.get("fileData")

    if file_data:
        try:
            file = File.objects.get(id=int(pk))

            if file.is_owned_by(request.user):
                data = json.loads(file_data)

                file.data = json.dumps(data)
                file.save()

                return JsonResponse({"status": "ok"})
        except:
            pass

    return JsonResponse({"status": "error"})


@login_required
@require_POST
def save_file_name(request, pk):
    name = request.POST.get("name")

    if name:
        try:
            file = File.objects.get(id=int(pk))

            if file.is_owned_by(request.user):
                file.name = name
                file.save()
                return JsonResponse({"status": "ok"})
        except:
            pass

    return JsonResponse({"status": "error"})


@login_required
def delete_file(request, pk):
    # check if the file exists
    try:
        file = File.objects.get(id=int(pk))

        # check if the user is the owner of the file
        if file.is_owned_by(request.user):
            file.delete()
    except:
        pass
    return redirect('dashboard')


@login_required
@require_POST
def toggle_public(request, pk):
    try:
        file = File.objects.get(id=int(pk))

        if file.is_owned_by(request.user):
            file.is_public = not file.is_public
            file.save()
            return JsonResponse({"status": "ok"})
    except:
        pass

    return JsonResponse({"status": "error"})


@login_required
def clone_file(request, pk):
    # check if the file exists
    try:
        file = File.objects.get(id=int(pk))

        file_copy = file.clone(request.user)
        return redirect('view_file', pk=file_copy.id)
    except:
        return redirect('dashboard')


@login_required
def dashboard(request):
    ACCESS_TYPES = {'sequential': ["TOF", "TnOF", "LOF", "LnOF"],
                    'indexed': ["clustered", "not_clustered"],
                    'hashing': ["essai_linear"]}
    if request.method == 'POST':
        f_name = request.POST.get('name')
        f_access = request.POST.get('access').strip()
        f_type = request.POST.get('type').strip()
        max_nb_enregs = request.POST.get('max-nb-enregs').strip()
        max_nb_blocks = request.POST.get('max-nb-blocks').strip()

        if 1 <= len(f_name) <= 100 and f_access in ACCESS_TYPES.keys() and \
                f_type in ACCESS_TYPES[f_access] and 5 <= int(max_nb_blocks) <= 100 and 4 <= int(max_nb_enregs) <= 8:
            data = {
                "name": f_name,
                "characteristics": {
                    "maxNbEnregs": max_nb_enregs,
                    "maxNbBlocks": max_nb_blocks,
                    "nbBlocks": 0,
                    "nbInsertions": 0
                },
                "blocks": [],
            }

            if f_type in ['LOF', 'LnOF']:
                data["characteristics"]["headIndex"] = -1
                data["characteristics"]["tailIndex"] = -1

            if f_type == 'clustered':
                data["indexTable"] = []
                data["characteristics"]["maxIndex"] = max_nb_blocks

            if f_type == 'not_clustered':
                data["indexTable"] = []
                data["characteristics"]["maxIndex"] = int(max_nb_blocks) * int(max_nb_enregs)

            file = File(
                owner=request.user,
                name=f_name,
                file_access=f_access,
                file_type=f_type
            )
            file.save()
            file.data = json.dumps(data)
            file.save()

            return redirect('view_file', pk=file.id)

    files_all = request.user.file_set.all().order_by('-date_created')

    paginator = Paginator(files_all, 20)
    page = request.GET.get('page')
    try:
        files = paginator.page(page)
    except PageNotAnInteger:
        files = paginator.page(1)
    except EmptyPage:
        files = paginator.page(paginator.num_pages)
    context = {
        'files': files
    }
    return render(request, 'files/dashboard/index.html', context)


# this is used to delete a file (real time) in the dashboard
@login_required
@require_POST
def delete_file_dashboard(request):
    pk = request.POST.get("pk")

    if pk:
        try:
            file = File.objects.get(id=int(pk))

            # check if the user is the owner of the file
            if file.is_owned_by(request.user):
                file.delete()
                return JsonResponse({"status": "ok"})
        except:
            pass
    return JsonResponse({"status": "error"})
