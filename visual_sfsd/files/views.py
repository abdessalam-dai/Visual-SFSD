from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import Http404
from .models import File
from .forms import CreateFileForm
import json


def file_view(request, pk):
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
            'data': file.data
        }

        if file.file_type == 'TOF':
            template_path = 'files/view_file/TOF/index.html'
        else:  # elif file.file_type == 'TnOF':
            template_path = 'files/view_file/TnOF/index.html'

        return render(request, template_path, context)
    except:
        raise Http404


def create_file(request):
    # form =
    return render(request, 'files/create_file/index.html')
