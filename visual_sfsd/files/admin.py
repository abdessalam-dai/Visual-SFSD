from django.contrib import admin
from .models import File


class FileAdmin(admin.ModelAdmin):
    list_display = ('owner', 'file_access', 'file_type', 'name')


admin.site.register(File, FileAdmin)
