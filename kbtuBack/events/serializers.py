from rest_framework import serializers
from .models import Event 

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [ 'id', 'name', 'location', 'topic', 'speakers', 'event_date', 'event_time', 'event_type', 'school', 'image']

class EventRegistrationSerializer(serializers.Serializer):
    event_id = serializers.IntegerField(required=True)# We don't serialize user_id for input, it's taken from the authenticated request.
    # We don't serialize registration_date, it's auto-added.

    def validate_event_id(self, value): #ckecking 
        if not Event.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Event with this ID does not exist.")
        return value

class EventFeedbackSerializer(serializers.Serializer):
    event_id = serializers.IntegerField(required=True)
    comment = serializers.CharField(required=True, max_length=1000) 
    rating = serializers.IntegerField(required=True, min_value=1, max_value=5)

    def validate_event_id(self, value):# jsut a check
        """Check that the event exists."""
        if not Event.objects.filter(pk=value).exists():
            raise serializers.ValidationError("Event with this ID does not exist.")
        return value