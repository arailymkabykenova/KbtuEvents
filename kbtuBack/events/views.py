from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, EventRegistration, EventFeedback
from .serializers import EventSerializer, EventRegistrationSerializer, EventFeedbackSerializer
from datetime import datetime
from django.db import IntegrityError
from django.shortcuts import get_object_or_404 


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-event_date')
    serializer_class = EventSerializer
    permission_classes = [AllowAny] 

    @action(detail=False, methods=['get'], url_path='by_date')
    def get_by_date(self, request):
        date_str = request.query_params.get('date')
        if not date_str: return Response({"error": "Missing 'date' parameter"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            events = Event.objects.filter(event_date=date_obj)
            serializer = self.get_serializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError: return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_for_event(request):
    serializer = EventRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        event_id = serializer.validated_data['event_id']
        user = request.user
        event_instance = get_object_or_404(Event, pk=event_id)# here we check if the event exists 

        if EventRegistration.objects.filter(user=user, event=event_instance).exists():
             return Response({'error': 'Already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        from django.utils import timezone #here we control that user can not register to the past event 
        if event_instance.event_date < timezone.now().date():
             return Response({'error': 'Cannot register for an event that has already passed.'}, status=status.HTTP_400_BAD_REQUEST)


        try:
            registration = EventRegistration.objects.create(user=user, event=event_instance)
            return Response({'message': 'Successfully registered for the event.'}, status=status.HTTP_201_CREATED)

        except IntegrityError: 
             return Response({'error': 'Already registered for this event (concurrent request).'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
             print(f"Error during registration creation: {e}")
             return Response({'error': 'Could not register for event due to a server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_event_feedback(request):
    serializer = EventFeedbackSerializer(data=request.data)
    if serializer.is_valid():
        event_id = serializer.validated_data['event_id']
        comment = serializer.validated_data['comment']
        rating = serializer.validated_data['rating']
        user = request.user
        event_instance = get_object_or_404(Event, pk=event_id) 

        if EventFeedback.objects.filter(user=user, event=event_instance).exists():
            return Response({'error': 'You have already left feedback for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            feedback = EventFeedback.objects.create(
                user=user, event=event_instance, comment=comment, rating=rating
            )
            return Response({'message': 'Feedback added successfully.'}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'Feedback already submitted (concurrent request).'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error during feedback creation: {e}")
            return Response({'error': 'Could not add feedback due to a server error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)