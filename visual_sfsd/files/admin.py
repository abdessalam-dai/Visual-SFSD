from django.contrib import admin
from .models import File, Block, Enreg


class FileAdmin(admin.ModelAdmin):
    list_display = ('owner', 'name', 'nb_max_enregs')


class BlockAdmin(admin.ModelAdmin):
    list_display = ('file', 'index', 'next_block_index', 'nb')


class EnregAdmin(admin.ModelAdmin):
    list_display = ('block', 'index', 'key', 'removed')


admin.site.register(File, FileAdmin)
admin.site.register(Block, BlockAdmin)
admin.site.register(Enreg, EnregAdmin)
