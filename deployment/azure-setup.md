# Guía de Despliegue en Azure Container Apps

## Arquitectura Recomendada

### Opción 1: Azure Container Apps (Recomendada)
- **Frontend**: Next.js en Container App
- **Backend**: FastAPI en Container App  
- **Base de datos**: Supabase (externa)
- **Ventajas**: Escalado automático, costo-efectivo, fácil gestión

### Opción 2: Azure App Service
- **Frontend**: Next.js en App Service
- **Backend**: FastAPI en App Service
- **Base de datos**: Supabase (externa)
- **Ventajas**: Más simple, menos configuración

### Opción 3: Azure Kubernetes Service (AKS)
- **Todo**: En cluster de Kubernetes
- **Ventajas**: Máximo control, escalado avanzado
- **Desventajas**: Más complejo, mayor costo

## Pasos de Migración

### 1. Preparar Dockerfiles

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Configurar Azure Container Registry
```bash
# Crear resource group
az group create --name rg-enfermeria-app --location eastus

# Crear container registry
az acr create --resource-group rg-enfermeria-app --name enfermeriaacr --sku Basic

# Login al registry
az acr login --name enfermeriaacr
```

### 3. Construir y subir imágenes
```bash
# Frontend
docker build -t enfermeriaacr.azurecr.io/frontend:latest ./frontend
docker push enfermeriaacr.azurecr.io/frontend:latest

# Backend  
docker build -t enfermeriaacr.azurecr.io/backend:latest ./backend
docker push enfermeriaacr.azurecr.io/backend:latest
```

### 4. Crear Container Apps Environment
```bash
# Crear environment
az containerapp env create \
  --name enfermeria-env \
  --resource-group rg-enfermeria-app \
  --location eastus
```

### 5. Desplegar aplicaciones
```bash
# Frontend
az containerapp create \
  --name enfermeria-frontend \
  --resource-group rg-enfermeria-app \
  --environment enfermeria-env \
  --image enfermeriaacr.azurecr.io/frontend:latest \
  --target-port 3000 \
  --ingress external

# Backend
az containerapp create \
  --name enfermeria-backend \
  --resource-group rg-enfermeria-app \
  --environment enfermeria-env \
  --image enfermeriaacr.azurecr.io/backend:latest \
  --target-port 8000 \
  --ingress internal
```

## Variables de Entorno

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://enfermeria-backend.azurecontainerapps.io
NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-key
```

### Backend
```
SUPABASE_URL=tu-supabase-url
SUPABASE_KEY=tu-supabase-service-key
CORS_ORIGINS=https://enfermeria-frontend.azurecontainerapps.io
```

## Costos Estimados (Mensual)

### Azure Container Apps
- **Environment**: ~$0.50/día = $15/mes
- **Frontend**: ~$5-15/mes (dependiendo del tráfico)
- **Backend**: ~$5-15/mes
- **Total**: ~$25-45/mes

### Alternativa: Azure App Service
- **Frontend**: ~$10-20/mes
- **Backend**: ~$10-20/mes  
- **Total**: ~$20-40/mes

## Ventajas de Azure Container Apps

1. **Escalado automático**: Se adapta al tráfico
2. **Costo-efectivo**: Solo pagas por uso
3. **Fácil CI/CD**: Integración con GitHub Actions
4. **Manejo de contenedores**: Sin Kubernetes
5. **Networking**: Comunicación interna entre apps
6. **Monitoreo**: Azure Monitor integrado

## Próximos Pasos

1. Crear archivos Docker
2. Configurar Azure CLI
3. Crear recursos en Azure
4. Configurar CI/CD
5. Desplegar aplicaciones
6. Configurar dominio personalizado
7. Configurar SSL/TLS

