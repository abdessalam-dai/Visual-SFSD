from django.contrib import admin
from .models import File


class FileAdmin(admin.ModelAdmin):
    list_display = ('owner', 'name', 'nb_max_enregs')


admin.site.register(File, FileAdmin)
