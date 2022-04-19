from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_file, name='create_file'),

    path('file/<str:pk>', views.view_file, name='view_file'),
    path('file/save/<str:pk>', views.save_file, name='save_file'),
    path('file/save/name/<str:pk>', views.save_file_name, name='save_file_name'),
    path('file/delete/<str:pk>', views.delete_file, name='delete_file'),

    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/delete/', views.delete_file_dashboard, name='delete_file_dashboard'),
]
