from django.contrib import admin
from .models import File


class FileAdmin(admin.ModelAdmin):
    list_display = ('owner', 'name')


admin.site.register(File, FileAdmin)
