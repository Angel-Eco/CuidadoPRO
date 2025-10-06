# Panel de Administración - Frontend

## 🚀 Funcionalidades Implementadas

### 1. **Sistema de Autenticación Frontend**
- ✅ Context API para gestión de estado global
- ✅ Login/Logout con JWT tokens
- ✅ Persistencia de sesión en localStorage
- ✅ Protección de rutas privadas
- ✅ Manejo de estados de carga y errores

### 2. **Servicios API**
- ✅ Servicio completo de autenticación
- ✅ Servicios del panel de administración
- ✅ Manejo de errores y respuestas
- ✅ Tipado TypeScript completo
- ✅ Interceptores para tokens JWT

### 3. **Interfaz de Usuario**
- ✅ Formulario de login moderno y responsive
- ✅ Layout de administración con sidebar
- ✅ Dashboard con estadísticas visuales
- ✅ Tabla de solicitudes con filtros
- ✅ Modal para editar solicitudes
- ✅ Sistema de navegación intuitivo

## 📁 Estructura de Archivos

```
frontend/
├── contexts/
│   └── AuthContext.tsx          # Context de autenticación
├── services/
│   └── api.ts                   # Servicios API
├── components/
│   └── admin/
│       ├── LoginForm.tsx        # Formulario de login
│       ├── AdminLayout.tsx      # Layout del panel
│       ├── Dashboard.tsx        # Dashboard con estadísticas
│       └── SolicitudesTable.tsx # Tabla de solicitudes
└── app/
    └── admin/
        ├── page.tsx             # Página principal del admin
        └── solicitudes/
            └── page.tsx         # Página de solicitudes
```

## 🔐 Autenticación

### **Credenciales por Defecto**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Email:** `admin@enfermeria.com`

### **Flujo de Autenticación**
1. Usuario ingresa credenciales en `/admin`
2. Se valida con el backend `/api/auth/login`
3. Se almacena JWT token en localStorage
4. Se redirige al dashboard
5. Todas las requests incluyen el token automáticamente

## 📊 Dashboard

### **Estadísticas Mostradas**
- Total de solicitudes
- Solicitudes pendientes
- Solicitudes en progreso
- Solicitudes completadas
- Solicitudes por tipo de servicio (gráfico de barras)
- Solicitudes por mes (últimos 12 meses)
- Acciones rápidas

### **Tarjetas de Estado**
- **Pendiente:** Amarillo con ícono de reloj
- **Confirmada:** Azul con ícono de check
- **En Progreso:** Naranja con ícono de actividad
- **Completada:** Verde con ícono de check
- **Cancelada:** Rojo con ícono de X

## 📋 Gestión de Solicitudes

### **Filtros Disponibles**
- **Búsqueda:** Por nombre, email o teléfono
- **Estado:** Todos, pendiente, confirmada, etc.
- **Tipo de servicio:** Todos, curación, inyecciones, etc.
- **Limpiar filtros:** Botón para resetear

### **Acciones por Solicitud**
- **Ver detalles:** Modal con información completa
- **Cambiar estado:** Dropdown con todos los estados
- **Cancelar:** Soft delete (cambia estado a "cancelada")

### **Información Mostrada**
- Datos del cliente (nombre, email, teléfono)
- Tipo de servicio solicitado
- Estado actual con badge colorizado
- Fecha de creación
- Fecha sugerida (si aplica)
- Comentarios del cliente

## 🎨 Diseño y UX

### **Características de Diseño**
- **Responsive:** Funciona en desktop, tablet y móvil
- **Moderno:** Usando Tailwind CSS
- **Consistente:** Colores y estilos unificados
- **Accesible:** Navegación por teclado y screen readers

### **Colores del Sistema**
- **Primario:** Verde (`#10B981` - primary-green)
- **Estados:** Amarillo, azul, naranja, verde, rojo
- **Neutros:** Grises para texto y fondos
- **Feedback:** Verde para éxito, rojo para errores

### **Componentes Reutilizables**
- Badges de estado
- Botones con estados de carga
- Modales responsivos
- Tablas con paginación
- Formularios con validación

## 🔧 Configuración

### **Variables de Entorno**
```typescript
// En services/api.ts
const API_BASE_URL = 'http://localhost:8000/api'
```

### **Dependencias Requeridas**
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.0"
}
```

## 🚀 Cómo Usar

### 1. **Acceder al Panel**
- Ir a `http://localhost:3000/admin`
- Ingresar credenciales
- Serás redirigido al dashboard

### 2. **Navegar por el Panel**
- **Dashboard:** Estadísticas generales
- **Solicitudes:** Gestión completa de solicitudes
- **Usuarios:** (Solo admin) Gestión de usuarios
- **Configuración:** Ajustes del sistema

### 3. **Gestionar Solicitudes**
- Ver lista filtrable de solicitudes
- Hacer clic en el ícono del ojo para ver detalles
- Cambiar estado desde el modal
- Usar filtros para encontrar solicitudes específicas

## 🔄 Integración con Backend

### **Endpoints Utilizados**
- `POST /api/auth/login` - Autenticación
- `GET /api/auth/me` - Info del usuario
- `GET /api/admin/solicitudes` - Lista de solicitudes
- `PUT /api/admin/solicitudes/{id}` - Actualizar solicitud
- `GET /api/admin/estadisticas` - Estadísticas del dashboard

### **Manejo de Errores**
- Errores de autenticación mostrados en login
- Errores de API mostrados en componentes
- Estados de carga durante requests
- Validación de formularios en tiempo real

## 🎯 Próximas Funcionalidades

### **Funcionalidades Sugeridas**
1. **Gestión de Usuarios**
   - CRUD completo de usuarios
   - Asignación de roles
   - Cambio de contraseñas

2. **Notificaciones**
   - Sistema de notificaciones en tiempo real
   - Alertas de nuevas solicitudes
   - Notificaciones por email/WhatsApp

3. **Reportes Avanzados**
   - Exportar datos a Excel/PDF
   - Gráficos más detallados
   - Filtros de fecha personalizados

4. **Configuración**
   - Configuración de tipos de servicio
   - Configuración de horarios
   - Configuración de notificaciones

## 🛠️ Desarrollo

### **Para Agregar Nuevas Páginas**
1. Crear componente en `components/admin/`
2. Crear página en `app/admin/`
3. Agregar ruta en `AdminLayout.tsx`
4. Implementar servicios API si es necesario

### **Para Modificar Estilos**
- Usar clases de Tailwind CSS
- Mantener consistencia con colores del sistema
- Asegurar responsividad
- Probar en diferentes dispositivos

## 📱 Responsive Design

### **Breakpoints**
- **Mobile:** < 768px (sidebar colapsado)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **Adaptaciones Móviles**
- Sidebar como overlay en móvil
- Tabla con scroll horizontal
- Modal full-screen en móvil
- Botones más grandes para touch

El panel de administración está completamente funcional y listo para usar. Proporciona una interfaz moderna e intuitiva para gestionar todas las solicitudes de enfermería a domicilio.





