from django.db import models
from django.conf import settings 
from django.core.validators import MinValueValidator, MaxValueValidator 

class Event(models.Model):
    SCHOOL_CHOICES = [
        ('all', 'All Schools'), ('bs', 'Business School'), ('site', 'School of IT & Engineering'),
        ('seogi', 'School of Energy & Oil and Gas'), ('sg', 'School of Geology'),
        ('ise', 'International School of Economics'), ('kma', 'Kazakhstan Maritime Academy'),
        ('sam', 'School of Applied Mathematics'), ('sce', 'School of Chemical Engineering'),
    ]
    EVENT_TYPE_CHOICES = [
        ('lecture', 'Lecture'), ('master_class', 'Master Class'), ('competition', 'Competition'),
        ('cultural', 'Cultural'), ('volunteering', 'Volunteering'),
    ]
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    topic = models.TextField()
    speakers = models.CharField(max_length=300)
    school = models.CharField(max_length=10, choices=SCHOOL_CHOICES)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    event_date = models.DateField()
    event_time = models.TimeField()
    image = models.ImageField(upload_to='event_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.school}"


class EventRegistration(models.Model):
    user = models.ForeignKey(# ForeignKey refers Custom User model in settings
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    registration_date = models.DateTimeField(auto_now_add=True)

    class Meta: # here we make sure that user can register only once
        unique_together = ('user', 'event')
        ordering = ['-registration_date'] 
    def __str__(self):
        return f"{self.user.username} registered for {self.event.name}"

class EventFeedback(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    event = models.ForeignKey(# ForeignKey link to the Event model
        Event,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    comment = models.TextField()
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)] 
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event') # here we make sure user can leave one comment only per event 
        ordering = ['-created_at'] 

    def __str__(self):
        return f"Feedback by {self.user.username} for {self.event.name} ({self.rating} stars)"