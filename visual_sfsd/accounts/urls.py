from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_user, name="logout"),
    path('register/', views.register, name='register'),

    path('settings/', views.settings, name='settings'),
    path('profile/<str:username>', views.profile, name='profile'),
    path('change_password/', views.change_password, name='change_password'),

    path('students/', views.students_list, name='students_list'),
]
