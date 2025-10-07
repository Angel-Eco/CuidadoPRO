# CuidadoPRO - Plataforma de Servicios de Enfermería a Domicilio

Una plataforma completa de servicios de enfermería a domicilio que conecta pacientes con profesionales de la salud calificados. Construida con tecnologías modernas para ofrecer una experiencia fluida tanto para usuarios como para administradores.

## 🏗️ Arquitectura del Proyecto

Este proyecto utiliza una arquitectura de microservicios con frontend y backend separados:

```
CuidadoPRO/
├── frontend/          # Aplicación Next.js (Frontend)
├── backend/           # API FastAPI (Backend)
├── deployment/        # Configuraciones de despliegue
└── README.md         # Este archivo
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos y consistentes
- **React Hook Form** - Manejo de formularios

### Backend
- **FastAPI** - Framework web moderno y rápido para Python
- **Supabase** - Base de datos PostgreSQL en la nube
- **Pydantic** - Validación de datos y serialización
- **JWT** - Autenticación con tokens
- **Python 3.11+** - Lenguaje de programación

### Base de Datos
- **Supabase PostgreSQL** - Base de datos relacional en la nube
- **Row Level Security (RLS)** - Seguridad a nivel de fila
- **Real-time subscriptions** - Actualizaciones en tiempo real

### Despliegue
- **Docker** - Containerización de aplicaciones
- **Docker Compose** - Orquestación de contenedores
- **Render** - Plataforma de despliegue en la nube

## 📋 Funcionalidades

### Para Pacientes
- 🏠 **Landing Page** - Página de aterrizaje profesional
- 📝 **Solicitud de Servicios** - Formulario para solicitar cuidados
- 📱 **Interfaz Responsiva** - Optimizada para móviles
- 💬 **Integración WhatsApp** - Contacto directo

### Para Profesionales
- 👩‍⚕️ **Registro de Profesionales** - Sistema de registro y verificación
- 📊 **Panel de Control** - Gestión de solicitudes y perfil
- 🔔 **Notificaciones** - Alertas de nuevas solicitudes

### Para Administradores
- 🛡️ **Panel de Administración** - Gestión completa del sistema
- 👥 **Gestión de Usuarios** - Administración de profesionales y pacientes
- 📈 **Dashboard** - Estadísticas y métricas del sistema
- ⚙️ **Configuración** - Ajustes del sistema

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- Python 3.11+
- Docker (opcional)
- Cuenta de Supabase

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Angel-Eco/CuidadoPRO.git
cd CuidadoPRO
```

### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp env.example .env
```

Editar `.env` con tus credenciales de Supabase:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
JWT_SECRET_KEY=tu_jwt_secret_key
```

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

### 4. Configurar la Base de Datos

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar los scripts SQL en el orden correcto:
   - `backend/supabase_schema_simple.sql`
   - `backend/schema_profesionales.sql`
   - `backend/schema_admin.sql`
   - `backend/migration_add_estado_column.sql`

## 🚀 Ejecución

### Desarrollo Local

#### Backend (Puerto 8000)
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
uvicorn main:app --reload
```

#### Frontend (Puerto 3000)
```bash
cd frontend
npm run dev
```

### Con Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose -f deployment/docker-compose.yml up --build
```

## 📁 Estructura del Proyecto

### Backend (`/backend`)
```
backend/
├── auth/                 # Autenticación y middleware
├── database/             # Conexión a la base de datos
├── models/               # Modelos de datos (Pydantic)
├── routers/              # Endpoints de la API
├── requirements.txt      # Dependencias de Python
├── main.py              # Punto de entrada de la aplicación
└── Dockerfile           # Configuración de Docker
```

### Frontend (`/frontend`)
```
frontend/
├── app/                  # App Router de Next.js
│   ├── admin/           # Panel de administración
│   ├── globals.css      # Estilos globales
│   └── layout.tsx       # Layout principal
├── components/          # Componentes reutilizables
├── contexts/           # Contextos de React
├── services/           # Servicios de API
├── public/             # Archivos estáticos
└── package.json        # Dependencias de Node.js
```

### Deployment (`/deployment`)
```
deployment/
├── docker-compose.yml   # Orquestación de contenedores
├── azure-deploy.sh     # Script de despliegue en Azure
└── azure-setup.md      # Documentación de Azure
```

## 🔧 Scripts Disponibles

### Backend
```bash
# Ejecutar servidor de desarrollo
uvicorn main:app --reload

# Ejecutar tests
python -m pytest

# Verificar conexión a la base de datos
python test_connection.py
```

### Frontend
```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 🌐 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registro de profesionales
- `GET /auth/me` - Obtener perfil del usuario

### Profesionales
- `GET /profesionales/` - Listar profesionales
- `POST /profesionales/` - Crear profesional
- `PUT /profesionales/{id}` - Actualizar profesional
- `DELETE /profesionales/{id}` - Eliminar profesional

### Solicitudes
- `GET /solicitudes/` - Listar solicitudes
- `POST /solicitudes/` - Crear solicitud
- `PUT /solicitudes/{id}` - Actualizar solicitud
- `DELETE /solicitudes/{id}` - Eliminar solicitud

### Administración
- `GET /admin/estadisticas` - Estadísticas del sistema
- `GET /admin/usuarios` - Gestión de usuarios

## 🚀 Despliegue

### Render (Recomendado)

#### Frontend en Render (CON Docker):
1. **Crear nuevo Web Service** en Render
2. **Conectar repositorio** de GitHub
3. **Configurar build settings**:
   - **Dockerfile Path**: `frontend/Dockerfile`
   - **Docker**: ✅ **ACTIVAR**
   - **Environment**: `Docker`
4. **Variables de entorno** (OBLIGATORIAS):
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   NEXT_PUBLIC_API_URL=https://tu-backend-url.onrender.com
   NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
   NEXT_PUBLIC_APP_NAME=CuidadoPRO
   ```

#### Backend en Render (CON Docker):
1. **Crear nuevo Web Service** en Render
2. **Conectar repositorio** de GitHub
3. **Configurar build settings**:
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Docker**: ✅ **ACTIVAR**
   - **Environment**: `Docker`
4. **Variables de entorno**:
   ```
   SUPABASE_URL=tu_url_de_supabase
   SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
   JWT_SECRET_KEY=tu_jwt_secret_key_muy_seguro
   CORS_ORIGINS=https://tu-frontend-url.onrender.com
   ```

Ver [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) para instrucciones más detalladas.

### Azure
Ver [deployment/azure-setup.md](./deployment/azure-setup.md) para configuración en Azure.

### Docker
```bash
# Construir imagen
docker build -t cuidapro-backend ./backend
docker build -t cuidapro-frontend ./frontend

# Ejecutar con Docker Compose
docker-compose -f deployment/docker-compose.yml up -d
```

## 🔒 Variables de Entorno

### Backend (`.env`)
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
JWT_SECRET_KEY=tu_jwt_secret_key_muy_seguro
CORS_ORIGINS=http://localhost:3000,https://tu-dominio.com
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
NEXT_PUBLIC_APP_NAME=CuidadoPRO
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Desarrollador**: Angel-Eco
- **GitHub**: [@Angel-Eco](https://github.com/Angel-Eco)
- **Proyecto**: [CuidadoPRO](https://github.com/Angel-Eco/CuidadoPRO)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) por la excelente plataforma de base de datos
- [Next.js](https://nextjs.org) por el framework React
- [FastAPI](https://fastapi.tiangolo.com) por el framework Python
- [Tailwind CSS](https://tailwindcss.com) por el framework de estilos

---

**CuidadoPRO** - Conectando profesionales de la salud con pacientes que necesitan cuidados a domicilio. 💙
