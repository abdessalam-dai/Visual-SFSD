from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_user, name="logout"),
    path('register/', views.register, name='register'),
    path('settings/', views.settings, name='settings')
]
