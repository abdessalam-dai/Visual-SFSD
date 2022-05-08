from django.contrib import admin
from django.urls import path, include

handler404 = "base.views.page_not_found"

urlpatterns = [
    path('', include('base.urls')),
    path('files/', include('files.urls')),
    path('accounts/', include('accounts.urls')),
    path('admin/', admin.site.urls),
]

