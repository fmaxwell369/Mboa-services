import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# 1. Définition des Rôles du Système
class UserRoles(models.TextChoices):
    CITOYEN = 'CITOYEN', 'Citoyen'
    AGENT = 'AGENT', 'Agent Administratif'
    ADMIN = 'ADMIN', 'Administrateur'

# 2. Gestionnaire d'utilisateurs sur mesure
class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, email=None, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("Le numéro de téléphone est obligatoire.")
        
        if email:
            email = self.normalize_email(email)
            
        extra_fields.setdefault('role', UserRoles.CITOYEN)
        
        user = self.model(phone_number=phone_number, email=email, **extra_fields)
        user.set_password(password)  # Hachage sécurisé du mot de passe
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRoles.ADMIN)
        
        return self.create_user(phone_number, email, password, **extra_fields)

# 3. Le Modèle Utilisateur Principal
class CustomUser(AbstractBaseUser, PermissionsMixin):
    # UUID unique pour la sécurité des identifiants dans l'API
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    phone_number = models.CharField(max_length=20, unique=True, db_index=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    
    role = models.CharField(
        max_length=20, 
        choices=UserRoles.choices, 
        default=UserRoles.CITOYEN
    )
    
    # Status obligatoires pour Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    # Connexion principale via le numéro de téléphone
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

    def __str__(self):
        return f"{self.phone_number} - {self.role}"