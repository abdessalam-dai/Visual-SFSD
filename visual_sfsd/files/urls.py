from django.urls import path
from . import views


urlpatterns = [
    path('create/', views.create_file, name='create_file'),
    path('file/<str:pk>', views.file_view, name='file'),
]
