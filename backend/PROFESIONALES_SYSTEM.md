# Sistema de Gestión de Profesionales

## 📋 Descripción General

El sistema de gestión de profesionales permite administrar dinámicamente el equipo de enfermería que aparece en la página web. Los administradores pueden crear, editar, eliminar y gestionar la visibilidad de los profesionales sin necesidad de modificar código.

## 🏗️ Arquitectura del Sistema

### Backend (FastAPI + Supabase)

#### **Modelos de Datos**
- **`ProfesionalBase`**: Modelo base con validaciones
- **`ProfesionalCreate`**: Para crear nuevos profesionales
- **`ProfesionalUpdate`**: Para actualizar profesionales existentes
- **`ProfesionalResponse`**: Respuesta de la API

#### **Endpoints API**
```
GET    /api/profesionales/public/activos    # Obtener profesionales activos (público)
GET    /api/profesionales                   # Listar todos (admin)
GET    /api/profesionales/{id}              # Obtener uno específico (admin)
POST   /api/profesionales                   # Crear nuevo (admin)
PUT    /api/profesionales/{id}              # Actualizar (admin)
DELETE /api/profesionales/{id}              # Eliminar (admin)
```

#### **Base de Datos**
- **Tabla**: `profesionales`
- **Campos principales**:
  - `id`: UUID único
  - `nombre`: Nombre completo
  - `especialidad`: Área de expertise
  - `experiencia`: Años de experiencia
  - `descripcion`: Descripción detallada
  - `telefono`: Contacto telefónico
  - `email`: Contacto email
  - `imagen_url`: URL de la foto
  - `activo`: Visibilidad en la página
  - `orden`: Orden de aparición

### Frontend (Next.js + React)

#### **Componentes Principales**
- **`Professionals.tsx`**: Sección pública que muestra profesionales activos
- **`ProfesionalesTable.tsx`**: Panel de administración
- **`profesionalesAPI`**: Servicio para comunicación con la API

## 🚀 Funcionalidades Implementadas

### **Panel de Administración**
- ✅ **Lista completa** de profesionales con filtros
- ✅ **Búsqueda en tiempo real** por nombre, especialidad, descripción
- ✅ **Filtros avanzados** por especialidad y estado
- ✅ **Toggle de visibilidad** (activo/inactivo)
- ✅ **Vista detallada** de cada profesional
- ✅ **Eliminación** con confirmación
- ✅ **Contador de resultados** dinámico

### **Página Pública**
- ✅ **Carga dinámica** desde la base de datos
- ✅ **Solo profesionales activos** visibles
- ✅ **Información completa** (nombre, especialidad, experiencia, descripción)
- ✅ **Información de contacto** (teléfono, email)
- ✅ **Imágenes** con fallback a iniciales
- ✅ **Estados de carga y error**

### **Validaciones y Seguridad**
- ✅ **Validación de datos** en backend y frontend
- ✅ **Autenticación requerida** para operaciones admin
- ✅ **Políticas RLS** en Supabase
- ✅ **Sanitización de inputs**

## 📊 Estructura de Datos

### **Profesional**
```typescript
interface Profesional {
  id: string                    // UUID único
  nombre: string               // Nombre completo (2-100 chars)
  especialidad: string         // Especialidad (2-100 chars)
  experiencia: number          // Años (0-50)
  descripcion: string          // Descripción (10-500 chars)
  telefono?: string           // Teléfono opcional
  email?: string              // Email opcional
  imagen_url?: string         // URL de imagen opcional
  activo: boolean             // Visibilidad en página
  orden: number               // Orden de aparición
  created_at: string          // Fecha de creación
  updated_at?: string         // Fecha de actualización
}
```

### **Especialidades Disponibles**
- Enfermería General
- Enfermería Geriátrica
- Enfermería Pediátrica
- Enfermería Crítica
- Enfermería Comunitaria
- Cuidados Paliativos
- Rehabilitación
- Otros

## 🔧 Configuración e Instalación

### **1. Base de Datos**
```sql
-- Ejecutar el script de creación
\i schema_profesionales.sql
```

### **2. Backend**
```bash
# Las dependencias ya están en requirements.txt
# El router ya está incluido en main.py
```

### **3. Frontend**
```bash
# Los componentes ya están creados
# La API ya está configurada
```

## 📱 Uso del Sistema

### **Para Administradores**

#### **Acceder al Panel**
1. Ir a `/admin/profesionales`
2. Iniciar sesión con credenciales de admin

#### **Gestionar Profesionales**
1. **Ver lista**: Todos los profesionales con filtros
2. **Buscar**: Escribir en el campo de búsqueda
3. **Filtrar**: Por especialidad o estado
4. **Activar/Desactivar**: Click en el badge de estado
5. **Ver detalles**: Click en el ícono de ojo
6. **Eliminar**: Click en el ícono de basura

#### **Crear Nuevo Profesional**
1. Click en "Nuevo Profesional"
2. Llenar el formulario (próxima iteración)
3. Guardar

### **Para Visitantes**
- Los profesionales activos se muestran automáticamente en la sección "Nuestros Profesionales"
- La información se actualiza en tiempo real según los cambios del admin

## 🎨 Personalización

### **Estilos**
- Los estilos están integrados con Tailwind CSS
- Colores consistentes con el tema del sitio
- Responsive design para móviles y desktop

### **Contenido**
- Especialidades personalizables en el código
- Validaciones ajustables en los modelos
- Límites de caracteres configurables

## 🔮 Próximas Mejoras

### **Funcionalidades Pendientes**
1. **Formulario de creación/edición** completo
2. **Subida de imágenes** con preview
3. **Drag & drop** para reordenar profesionales
4. **Bulk operations** (activar/desactivar múltiples)
5. **Exportar/Importar** datos
6. **Historial de cambios** (audit log)

### **Mejoras Técnicas**
1. **Cache** de profesionales para mejor rendimiento
2. **Optimización de imágenes** automática
3. **Validación de URLs** de imágenes
4. **Notificaciones** de cambios
5. **Backup automático** de datos

## 🐛 Solución de Problemas

### **Problemas Comunes**

#### **Profesionales no aparecen en la página**
- Verificar que estén marcados como "activos"
- Revisar la consola del navegador por errores
- Verificar la conexión con la API

#### **Error al cargar el panel de admin**
- Verificar autenticación
- Revisar permisos de usuario
- Verificar conexión con la base de datos

#### **Imágenes no se muestran**
- Verificar URLs válidas
- Revisar permisos de acceso a imágenes
- Verificar formato de imagen soportado

### **Logs y Debugging**
- Backend: Revisar logs de FastAPI
- Frontend: Revisar consola del navegador
- Base de datos: Revisar logs de Supabase

## 📞 Soporte

Para problemas técnicos o dudas sobre el sistema:
1. Revisar esta documentación
2. Verificar logs de error
3. Contactar al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Mantenido por**: Equipo de Desarrollo




