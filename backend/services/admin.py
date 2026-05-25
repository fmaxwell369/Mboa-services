from django.contrib import admin
from .models import AdministrativeService, UserRequest

@admin.register(AdministrativeService)
class AdministrativeServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'stamp_duty', 'estimated_processing_time', 'is_active')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}  # Génère le slug automatiquement pendant que tu tapes le nom !

@admin.register(UserRequest)
class UserRequestAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'citizen', 'service', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('tracking_number', 'citizen__email', 'citizen__username')
    readonly_fields = ('tracking_number', 'created_at', 'updated_at')