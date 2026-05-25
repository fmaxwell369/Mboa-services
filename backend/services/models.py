import os
from django.db import models
from django.conf import settings

class AdministrativeService(models.Model):
    """Représente une démarche administrative (ex: Légalisation d'Acte)"""
    name = models.CharField(max_length=255, unique=True, verbose_name="Nom de la démarche")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(verbose_name="Description et instructions")
    
    # Coût officiel du timbre / de la taxe fiscale (ex: 1000.00 pour un timbre communal)
    stamp_duty = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Frais de timbre (FCFA)")
    
    # Estimation du temps de traitement (ex: "24h", "48h")
    estimated_processing_time = models.CharField(max_length=50, blank=True, verbose_name="Délai estimé")
    
    is_active = models.BooleanField(default=True, verbose_name="Disponible en ligne")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Démarche Administrative"
        verbose_name_plural = "Démarches Administratives"

    def __str__(self):
        return self.name


def user_directory_path(instance, filename):
    # Les fichiers seront uploadés dans : media/user_<id>/req_<uuid>/filename
    return f'user_{instance.citizen.id}/req_{instance.tracking_number}/{filename}'


class UserRequest(models.Model):
    STATUS_CHOICES = [
        ('SUBMITTED', 'Soumis'),
        ('IN_PROGRESS', 'En cours de traitement'),
        ('VALIDATED', 'Validé'),
        ('REJECTED', 'Rejeté'),
    ]

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requests')
    service = models.ForeignKey(AdministrativeService, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUBMITTED')
    tracking_number = models.CharField(max_length=50, unique=True)
    
    # --- CORRECTION ICI : upload_to au lieu de upload_data ---
    document = models.FileField(upload_to=user_directory_path, null=True, blank=True, verbose_name="Document justificatif")
    
    agent_notes = models.TextField(blank=True, null=True, verbose_name="Notes de l'agent")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Demande d'utilisateur"
        verbose_name_plural = "Demandes d'utilisateurs"

    def __str__(self):
        return f"{self.tracking_number} - {self.service.name}"