from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    # Les champs qui seront affichés dans la liste des utilisateurs
    list_display = ('phone_number', 'email', 'role', 'is_staff', 'is_active', 'date_joined')
    
    # Les filtres disponibles sur le côté droit
    list_filter = ('role', 'is_staff', 'is_active')
    
    # Les champs à utiliser pour la recherche
    search_fields = ('phone_number', 'email', 'first_name', 'last_name')
    
    # L'organisation des champs lors de la modification d'un utilisateur
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Informations Personnelles', {'fields': ('first_name', 'last_name', 'email')}),
        ('Droits & Rôles', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Configuration pour la création d'un utilisateur via l'admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'password', 'role', 'email', 'is_active'),
        }),
    )
    
    ordering = ('phone_number',)

# On enregistre notre modèle avec sa configuration personnalisée
admin.site.register(CustomUser, CustomUserAdmin)