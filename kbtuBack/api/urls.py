from django.urls import path
from .views import RegisterView,UserProfileView

urlpatterns = [
    path('registration/', RegisterView.as_view(), name='registration'),
    path('profile/',UserProfileView.as_view(),name='profile')
]