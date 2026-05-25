import uuid
from rest_framework import serializers
from .models import UserRequest, AdministrativeService

# 1. Serializer pour afficher les détails de la démarche administrative
class AdministrativeServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdministrativeService
        fields = ['id', 'name', 'slug', 'description', 'stamp_duty', 'estimated_processing_time', 'is_active']


# 2. Serializer pour la création et l'affichage des demandes de dossiers
class UserRequestSerializer(serializers.ModelSerializer):
    # Permet d'inclure les détails textuels du service dans la réponse JSON
    service_details = AdministrativeServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = UserRequest
        fields = [
            'id', 
            'service', 
            'service_details', 
            'status', 
            'tracking_number', 
            'document',  # <-- Nouveau champ pour le fichier justificatif
            'agent_notes', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['status', 'tracking_number', 'agent_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Assigne automatiquement l'utilisateur connecté comme auteur (citizen) de la demande
        validated_data['citizen'] = self.context['request'].user
        
        # Génère automatiquement le numéro de suivi unique (ex: REQ-A1B2C3D4)
        validated_data['tracking_number'] = f"REQ-{uuid.uuid4().hex[:8].upper()}"
        
        return super().create(validated_data)