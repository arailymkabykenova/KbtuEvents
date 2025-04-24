from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomerUser 

class CustomerUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'school', 'yearOfStudy', 'is_staff', 'is_active',)
    list_filter = ('school', 'yearOfStudy', 'is_staff', 'is_active', 'groups')
    search_fields = ('username', 'email', 'school')
    fieldsets = UserAdmin.fieldsets + (
        ('School Info', {'fields': ('school', 'yearOfStudy')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('School Info', {'fields': ('school', 'yearOfStudy')}),
    )

admin.site.register(CustomerUser, CustomerUserAdmin)