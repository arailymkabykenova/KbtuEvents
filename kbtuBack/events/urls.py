from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, register_for_event, add_event_feedback

router = DefaultRouter()
router.register(r'', EventViewSet, basename='event') 

urlpatterns = [
    path('register/', register_for_event, name='event-register'),  
    path('feedback/', add_event_feedback, name='event-feedback'), 
    path('', include(router.urls)),
]