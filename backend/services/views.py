from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import AdministrativeService, UserRequest
from .serializers import AdministrativeServiceSerializer, UserRequestSerializer

class AdministrativeServiceListView(generics.ListAPIView):
    queryset = AdministrativeService.objects.filter(is_active=True)
    serializer_class = AdministrativeServiceSerializer
    permission_classes = [AllowAny]

class UserRequestListCreateView(generics.ListCreateAPIView):
    queryset = UserRequest.objects.all()
    serializer_class = UserRequestSerializer
    # On utilise uniquement AllowAny pour le développement local
    permission_classes = [AllowAny]