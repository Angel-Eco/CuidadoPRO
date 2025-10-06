# Backend - Enfermería a Domicilio API

API backend desarrollada con FastAPI para gestionar solicitudes de servicios de enfermería.

## Características

- **FastAPI**: Framework web moderno y rápido
- **Supabase**: Base de datos en la nube
- **Pydantic**: Validación de datos
- **CORS**: Configurado para permitir requests desde el frontend

## Instalación

1. Crear y activar entorno virtual:
```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp env.example .env
```

Editar `.env` con tus credenciales de Supabase:
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
```

## Ejecución

Asegúrate de tener el entorno virtual activado:
```bash
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Ejecutar la aplicación
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`

## Desactivar entorno virtual

Cuando termines de trabajar:
```bash
deactivate
```

## Endpoints

### POST /api/solicitud
Crear una nueva solicitud de servicio.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "telefono": "+56 9 1234 5678",
  "email": "juan@ejemplo.com",
  "direccion": "Calle 123, Santiago",
  "tipo_servicio": "curacion",
  "fecha_sugerida": "2024-01-15",
  "hora_sugerida": "10:00",
  "comentarios": "Necesito curación para herida post-operatoria"
}
```

**Tipos de servicio disponibles:**
- `curacion` - Curación
- `control-presion` - Control de presión
- `acompanamiento` - Acompañamiento
- `inyecciones` - Inyecciones
- `otros` - Otros

### GET /api/solicitudes
Obtener todas las solicitudes.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "telefono": "+56 9 1234 5678",
      "email": "juan@ejemplo.com",
      "direccion": "Calle 123, Santiago",
      "tipo_servicio": "curacion",
      "fecha_sugerida": "2024-01-15",
      "hora_sugerida": "10:00",
      "comentarios": "Necesito curación...",
      "fecha": "2024-01-01T10:00:00Z"
    }
  ]
}
```

## Estructura de la Base de Datos

Tabla: `solicitudes`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | Clave primaria (autogenerado) |
| nombre | text | Nombre completo (requerido) |
| telefono | text | Teléfono (requerido) |
| email | text | Correo electrónico (requerido) |
| direccion | text | Dirección completa (requerido) |
| tipo_servicio | text | Tipo de servicio (requerido) |
| fecha_sugerida | date | Fecha sugerida (opcional) |
| hora_sugerida | time | Hora sugerida (opcional) |
| comentarios | text | Comentarios adicionales (opcional) |
| fecha | timestamp | Fecha de creación (default: now()) |

## Configuración de Base de Datos

### 1. Crear la tabla en Supabase

Ejecuta el siguiente SQL en el editor SQL de Supabase:

**Opción A: Con Row Level Security (Recomendado para producción)**
```sql
-- Copia y pega el contenido de supabase_schema.sql
```

**Opción B: Versión simplificada (Para desarrollo)**
```sql
-- Copia y pega el contenido de supabase_schema_simple.sql
```

### 2. Datos de ejemplo (Opcional)

Para probar con datos de ejemplo:
```sql
-- Copia y pega el contenido de sample_data.sql
```

### 3. Verificar la tabla

Después de crear la tabla, deberías ver:
- Tabla `solicitudes` con todos los campos
- Índices para mejorar el rendimiento
- Datos de ejemplo (si los insertaste)
