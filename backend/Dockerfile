FROM python:3.11-slim

# Étape 2 : Définir les variables d'environnement système pour Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Étape 3 : Définir le dossier de travail dans le conteneur
WORKDIR /app

# Étape 4 : Installer les dépendances système nécessaires (compilateurs pour certaines libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Étape 5 : Copier et installer les dépendances Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Étape 6 : Copier le reste du code du backend
COPY . /app/