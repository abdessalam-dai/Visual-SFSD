from django.urls import path
from . import views


urlpatterns = [
    path('create/', views.create_file, name='create_file'),
    path('file/<str:pk>', views.view_file, name='view_file'),
    path('file/save/<str:pk>', views.save_file, name='save_file'),
]
