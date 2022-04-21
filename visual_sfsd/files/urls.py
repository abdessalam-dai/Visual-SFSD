from django.urls import path
from . import views

urlpatterns = [
    path('file/<str:pk>', views.view_file, name='view_file'),
    path('file/save/<str:pk>', views.save_file, name='save_file'),
    path('file/save/name/<str:pk>', views.save_file_name, name='save_file_name'),
    path('file/delete/<str:pk>', views.delete_file, name='delete_file'),
    path('file/toggle_public/<str:pk>', views.toggle_public, name='toggle_public'),
    path('file/clone/<str:pk>', views.clone_file, name='clone_file'),

    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/delete/', views.delete_file_dashboard, name='delete_file_dashboard'),
]
