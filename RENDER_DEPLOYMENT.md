# Guía de Despliegue en Render

## Configuración de Servicios

### Backend (FastAPI)
- **Tipo**: Web Service
- **Build Command**: `docker build -t backend .`
- **Start Command**: `docker run -p 8000:8000 backend`
- **Puerto**: 8000

### Frontend (Next.js)
- **Tipo**: Web Service  
- **Build Command**: `docker build -t frontend .`
- **Start Command**: `docker run -p 3000:3000 frontend`
- **Puerto**: 3000

## Variables de Entorno

### Backend (FastAPI)
```bash
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-service-role-key

# CORS
CORS_ORIGINS=https://tu-frontend.onrender.com

# Opcional
PYTHONPATH=/app
```

### Frontend (Next.js)
```bash
# API Backend
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Next.js
NODE_ENV=production
```

## Pasos para Desplegar

### 1. Preparar Repositorio
```bash
# Asegúrate de que todos los archivos estén en GitHub
git add .
git commit -m "Add Docker configuration for Render"
git push origin main
```

### 2. Crear Backend Service en Render
1. Ve a Render Dashboard
2. Click "New" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `enfermeria-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Port**: `8000`
5. Agrega las variables de entorno del backend
6. Click "Create Web Service"

### 3. Crear Frontend Service en Render
1. Ve a Render Dashboard
2. Click "New" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `enfermeria-frontend`
   - **Root Directory**: `frontend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Port**: `3000`
5. Agrega las variables de entorno del frontend
6. Click "Create Web Service"

### 4. Configurar URLs
- **Backend URL**: `https://enfermeria-backend.onrender.com`
- **Frontend URL**: `https://enfermeria-frontend.onrender.com`

## Verificación Post-Despliegue

### Backend
```bash
# Health check
curl https://tu-backend.onrender.com/health

# API endpoints
curl https://tu-backend.onrender.com/api/profesionales/public/activos
```

### Frontend
- Visita: `https://tu-frontend.onrender.com`
- Verifica que la API se conecte correctamente
- Prueba el login del admin

## Optimizaciones de Producción

### Backend
- ✅ Gunicorn con 4 workers
- ✅ Health check endpoint
- ✅ Logs estructurados
- ✅ Usuario no-root
- ✅ Multi-stage build

### Frontend
- ✅ Standalone output
- ✅ Optimización de imágenes
- ✅ Headers de seguridad
- ✅ Build optimizado
- ✅ Usuario no-root

## Monitoreo

### Logs
- Render proporciona logs en tiempo real
- Revisa los logs si hay errores de despliegue

### Health Checks
- Backend: `/health`
- Frontend: Verifica que cargue correctamente

## Troubleshooting

### Problemas Comunes
1. **Build falla**: Verifica que todos los archivos estén en el repositorio
2. **Variables de entorno**: Asegúrate de que estén configuradas correctamente
3. **CORS**: Verifica que `CORS_ORIGINS` apunte a tu frontend
4. **Supabase**: Verifica que las keys sean correctas

### Comandos de Debug
```bash
# Ver logs del backend
render logs --service enfermeria-backend

# Ver logs del frontend  
render logs --service enfermeria-frontend
```
