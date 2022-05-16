from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('feedback_list/', views.feedback_list, name='feedback_list'),
]
