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

    school = models.CharField(max_length=10, choices=SCHOOL_CHOICES)
    yearOfStudy = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(6)
        ]
    )

    def __str__(self):
        return f"{self.username} - {self.get_school_display()}"
