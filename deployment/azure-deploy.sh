#!/bin/bash

# Script de despliegue automático en Azure Container Apps
# Uso: ./azure-deploy.sh

set -e

# Variables de configuración
RESOURCE_GROUP="rg-enfermeria-app"
LOCATION="eastus"
ACR_NAME="enfermeriaacr"
ENVIRONMENT_NAME="enfermeria-env"
FRONTEND_APP="enfermeria-frontend"
BACKEND_APP="enfermeria-backend"

echo "🚀 Iniciando despliegue en Azure Container Apps..."

# 1. Crear Resource Group
echo "📦 Creando Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Crear Azure Container Registry
echo "🐳 Creando Azure Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# 3. Login al ACR
echo "🔐 Haciendo login al ACR..."
az acr login --name $ACR_NAME

# 4. Construir y subir imagen del frontend
echo "🏗️ Construyendo imagen del frontend..."
cd ../frontend
docker build -t $ACR_NAME.azurecr.io/frontend:latest .
docker push $ACR_NAME.azurecr.io/frontend:latest

# 5. Construir y subir imagen del backend
echo "🏗️ Construyendo imagen del backend..."
cd ../backend
docker build -t $ACR_NAME.azurecr.io/backend:latest .
docker push $ACR_NAME.azurecr.io/backend:latest

# 6. Crear Container Apps Environment
echo "🌍 Creando Container Apps Environment..."
az containerapp env create \
  --name $ENVIRONMENT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# 7. Obtener credenciales del ACR
echo "🔑 Obteniendo credenciales del ACR..."
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query "username" -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

# 8. Desplegar Backend
echo "⚙️ Desplegando backend..."
az containerapp create \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_NAME.azurecr.io/backend:latest \
  --target-port 8000 \
  --ingress internal \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    SUPABASE_URL="$SUPABASE_URL" \
    SUPABASE_KEY="$SUPABASE_KEY" \
    CORS_ORIGINS="https://$FRONTEND_APP.azurecontainerapps.io"

# 9. Obtener URL del backend
BACKEND_URL=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv)

# 10. Desplegar Frontend
echo "🎨 Desplegando frontend..."
az containerapp create \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT_NAME \
  --image $ACR_NAME.azurecr.io/frontend:latest \
  --target-port 3000 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    NODE_ENV="production" \
    NEXT_PUBLIC_API_URL="https://$BACKEND_URL" \
    NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY"

# 11. Obtener URLs finales
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query "properties.configuration.ingress.fqdn" -o tsv)

echo "✅ Despliegue completado!"
echo "🌐 Frontend: https://$FRONTEND_URL"
echo "⚙️ Backend: https://$BACKEND_URL"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar dominio personalizado (opcional)"
echo "2. Configurar SSL/TLS"
echo "3. Configurar monitoreo"
echo "4. Configurar CI/CD con GitHub Actions"

