from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('phone_number', 'password', 'first_name', 'last_name', 'email', 'role')

    def create(self, validated_data):
        # Utilisation de la méthode spécifique pour chiffrer le mot de passe
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'CITOYEN') # Rôle par défaut
        )
        return user
    