from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class CustomerUser(AbstractUser):
    SCHOOL_CHOICES = [
        ('bs', 'Business School'),
        ('site', 'School of IT & Engineering'),
        ('seogi', 'School of Energy & Oil and Gas'),
        ('sg', 'School of Geology'),
        ('ise', 'International School of Economics'),
        ('kma', 'Kazakhstan Maritime Academy'),
        ('sam', 'School of Applied Mathematics'),
        ('sce', 'School of Chemical Engineering'),
    ]

    school = models.CharField(max_length=10, choices=SCHOOL_CHOICES, blank=True, null=True)
    yearOfStudy = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)],
        blank=True, null=True
    )

    # Add related_name to prevent фclashes if needed (good practice)
    groups = models.ManyToManyField(
        'auth.Group', verbose_name='groups', blank=True,
        help_text='The groups this user belongs to...',
        related_name="api_customeruser_groups", # App-specific related_name
        related_query_name="customeruser_api",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', verbose_name='user permissions', blank=True,
        help_text='Specific permissions for this user.',
        related_name="api_customeruser_permissions", # App-specific related_name
        related_query_name="customeruser_api",
    )

    def __str__(self):
        return f"{self.username} - {self.get_school_display() if self.school else 'No School'}"