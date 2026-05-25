from django.urls import path
from .views import AdministrativeServiceListView, UserRequestListCreateView  # <-- L'importation se fait ici !

urlpatterns = [
    path('services-list/', AdministrativeServiceListView.as_view(), name='services_list'),
    path('my-requests/', UserRequestListCreateView.as_view(), name='user_requests'),
]