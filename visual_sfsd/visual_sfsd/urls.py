from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('base.urls')),
    path('files/', include('files.urls')),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),
]
