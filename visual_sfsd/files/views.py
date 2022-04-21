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

        # data = {"name": "file.txt", "maxNbEnregs": 5, "nbBlocks": 2, "nbInsertions": 8, "blocks": [
        #     {"enregs": [
        #         {"key": 28, "field1": "field1", "field2": "field2", "removed": False},
        #         {"key": 29, "field1": "field1", "field2": "field2", "removed": False},
        #         {"key": 75, "field1": "field1", "field2": "field2", "removed": False},
        #         {"key": 90, "field1": "field1", "field2": "field2", "removed": False},
        #         {"key": 122, "field1": "field1", "field2": "field2", "removed": False}], "nb": 5, "nextBlockIndex": -1},
        #     {
        #         "enregs": [
        #             {"key": 359,
        #              "field1": "field1",
        #              "field2": "field2",
        #              "removed": False},
        #             {"key": 362,
        #              "field1": "field1",
        #              "field2": "field2",
        #              "removed": False},
        #             {"key": 379,
        #              "field1": "field1",
        #              "field2": "field2",
        #              "removed": False}],
        #         "nb": 3,
        #         "nextBlockIndex": -1}]}
        #
        # json_data = json.dumps(data)
        # file.data = json_data
        # file.save()

        # data2 = {
        #     "name": "file.txt",
        #     "maxNbEnregs": 5,
        #     "nbBlocks": 2,
        #     "nbInsertions": 7,
        #     "blocks": [
        #         {
        #             "enregs": [
        #                 {
        #                     "key": 2,
        #                     "field1": "sebaa",
        #                     "field2": "yahia",
        #                     "removed": False
        #                 },
        #                 {
        #                     "key": 38,
        #                     "field1": "sebaa",
        #                     "field2": "yanis",
        #                     "removed": False
        #                 },
        #                 {
        #                     "key": 40,
        #                     "field1": "bilal",
        #                     "field2": "abdessalam",
        #                     "removed": False
        #                 },
        #                 {
        #                     "key": 44,
        #                     "field1": "mouloud",
        #                     "field2": "yahia",
        #                     "removed": False
        #                 },
        #                 {
        #                     "key": 53,
        #                     "field1": "tari",
        #                     "field2": "tari",
        #                     "removed": False
        #                 }
        #             ],
        #             "nb": 5,
        #             "nextBlockIndex": -1
        #         },
        #         {
        #             "enregs": [
        #                 {
        #                     "key": 73,
        #                     "field1": "kacimi",
        #                     "field2": "yahia",
        #                     "removed": False
        #                 },
        #                 {
        #                     "key": 83,
        #                     "field1": "houssam",
        #                     "field2": "mouloud",
        #                     "removed": False
        #                 }
        #             ],
        #             "nb": 2,
        #             "nextBlockIndex": -1
        #         }
        #     ]
        # }
        #
        # json_data = json.dumps(data2)
        # file.data = json_data
        # file.save()

        context = {
            'file': file,
            'dataPy': json.loads(file.data),
            'data': file.data,
        }

        template_path = 'files/view_file/index.html'

        return render(request, template_path, context)
    except:
        raise Http404


@login_required
@require_POST
def save_file(request, pk):
    file_data = request.POST.get("fileData")

    if file_data:
        try:
            file = File.objects.get(id=int(pk))

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
        if file.owner == request.user:
            file.delete()
    except:
        pass
    return redirect('dashboard')


@login_required
def dashboard(request):
    ACCESS_TYPES = {'sequential': ["TOF", "TnOF", "LOF", "LnOF"],
                    'indexed': ["clustered", "not_clustered"],
                    'hashing': ["static", "dynamic"]}
    if request.method == 'POST':
        f_name = request.POST.get('name').strip()
        f_access = request.POST.get('access').strip()
        f_type = request.POST.get('type').strip()
        max_nb_enregs = request.POST.get('max-nb-enregs').strip()
        max_nb_blocks = request.POST.get('max-nb-blocks').strip()

        if 1 <= len(f_name) <= 100 and f_access in ACCESS_TYPES.keys() and f_type in ACCESS_TYPES[
            f_access] and 5 <= int(max_nb_blocks) <= 100 and 4 <= int(max_nb_enregs) <= 8:
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

    user_files = request.user.file_set.all()
    context = {
        'user_files': user_files
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
            if file.owner == request.user:
                file.delete()
                messages.error(request, "You are not the owner of this file")
                return JsonResponse({"status": "ok"})
            else:
                messages.error(request, "You are not the owner of this file")
        except:
            pass
    return JsonResponse({"status": "error"})
