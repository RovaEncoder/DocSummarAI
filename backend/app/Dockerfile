# Utiliser une image Python légère
FROM python:3.9-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier le projet dans le conteneur
COPY . .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port utilisé par l'API
EXPOSE 8000

# Commande pour démarrer le serveur
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
