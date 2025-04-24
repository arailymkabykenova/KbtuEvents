from django.contrib import admin
from .models import Event 

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'event_date', 'event_type')
    search_fields = ('name', 'school', 'speakers')