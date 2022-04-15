from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import Http404, JsonResponse
from django.views.decorators.http import require_POST
from .models import File
from .forms import CreateFileForm
import json


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


def create_file(request):
    # form =
    return render(request, 'files/create_file/index.html')
