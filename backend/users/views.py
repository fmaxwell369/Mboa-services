from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import RegisterSerializer

# 1. VUE POUR L'INSCRIPTION (Telle qu'elle était avant)
class RegisterView(generics.CreateAPIView):
    queryset = RegisterSerializer.Meta.model.objects.all()
    permission_classes = (AllowAny,) # Tout le monde peut s'inscrire
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "message": "Utilisateur créé avec succès !",
            "user": {
                "phone_number": user.phone_number,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)


# 2. VUE POUR LE PROFIL SÉCURISÉ (Notre nouveauté)
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated] # Bloque la requête si le JWT est absent ou invalide
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        user = request.user # Django identifie automatiquement l'utilisateur grâce au JWT
        return Response({
            "id": user.id,
            "phone_number": user.phone_number,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "is_staff": user.is_staff
        }, status=status.HTTP_200_OK)