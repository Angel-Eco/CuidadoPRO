# Panel de Administración - Enfermería a Domicilio

## 🚀 Características Implementadas

### 1. **Sistema de Autenticación**
- ✅ Login/Logout con JWT
- ✅ Roles de usuario (admin, manager, viewer)
- ✅ Cambio de contraseñas
- ✅ Gestión de usuarios

### 2. **Panel de Administración**
- ✅ Dashboard con estadísticas
- ✅ Gestión de solicitudes
- ✅ Sistema de estados para solicitudes
- ✅ Filtros y búsquedas
- ✅ Comentarios administrativos

### 3. **Estados de Solicitudes**
- `pendiente` - Nueva solicitud
- `confirmada` - Solicitud confirmada
- `en_progreso` - Servicio en curso
- `completada` - Servicio finalizado
- `cancelada` - Solicitud cancelada

## 📋 Endpoints Disponibles

### **Autenticación** (`/api/auth/`)
- `POST /login` - Iniciar sesión
- `POST /register` - Registrar usuario (admin)
- `GET /me` - Información del usuario actual
- `POST /change-password` - Cambiar contraseña
- `GET /users` - Listar usuarios (admin)

### **Panel de Administración** (`/api/admin/`)
- `GET /solicitudes` - Listar todas las solicitudes
- `GET /solicitudes/{id}` - Obtener solicitud específica
- `PUT /solicitudes/{id}` - Actualizar estado de solicitud
- `GET /estadisticas` - Estadísticas del dashboard
- `GET /solicitudes-pendientes` - Solicitudes pendientes
- `DELETE /solicitudes/{id}` - Cancelar solicitud

### **Solicitudes Públicas** (`/api/`)
- `POST /solicitud` - Crear nueva solicitud
- `GET /solicitudes` - Listar solicitudes (público)

## 🔧 Configuración

### 1. **Instalar Dependencias**
```bash
pip install -r requirements.txt
```

### 2. **Configurar Variables de Entorno**
```bash
cp env.example .env
```

Editar `.env`:
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
SECRET_KEY=tu-clave-secreta-muy-larga-y-segura
```

### 3. **Configurar Base de Datos**
Ejecutar en Supabase SQL Editor:
```sql
-- Copiar y pegar el contenido de schema_admin.sql
```

### 4. **Ejecutar la Aplicación**
```bash
uvicorn main:app --reload
```

## 👤 Usuario por Defecto

**Usuario:** `admin`  
**Contraseña:** `admin123`  
**Email:** `admin@enfermeria.com`

⚠️ **IMPORTANTE:** Cambiar la contraseña en producción.

## 🔐 Roles de Usuario

### **Admin**
- Acceso completo al sistema
- Gestionar usuarios
- Gestionar todas las solicitudes
- Ver estadísticas completas

### **Manager**
- Gestionar solicitudes
- Ver estadísticas
- No puede gestionar usuarios

### **Viewer**
- Solo lectura
- Ver solicitudes
- Ver estadísticas básicas

## 📊 Dashboard - Estadísticas Disponibles

- **Total de solicitudes**
- **Solicitudes por estado** (pendientes, confirmadas, etc.)
- **Solicitudes por tipo de servicio**
- **Solicitudes por mes** (últimos 12 meses)

## 🔍 Filtros Disponibles

### **Solicitudes**
- Por estado
- Por tipo de servicio
- Paginación (limit/offset)
- Ordenamiento por fecha

## 🛡️ Seguridad

- **JWT Tokens** con expiración de 24 horas
- **Hash de contraseñas** con bcrypt
- **Row Level Security** en Supabase
- **Validación de roles** en endpoints
- **CORS configurado** para el frontend

## 📱 Integración con Frontend

El panel está diseñado para integrarse con:
- **React/Next.js** frontend
- **Autenticación JWT** en el frontend
- **Llamadas API** a los endpoints protegidos
- **Gestión de estado** para el usuario autenticado

## 🚀 Próximos Pasos Sugeridos

1. **Crear frontend del panel de administración**
2. **Implementar notificaciones por WhatsApp**
3. **Agregar sistema de citas**
4. **Implementar reportes avanzados**
5. **Agregar sistema de backup**

## 📞 Soporte

Para dudas o problemas:
- Revisar logs de la aplicación
- Verificar configuración de Supabase
- Comprobar variables de entorno
- Validar esquema de base de datos





