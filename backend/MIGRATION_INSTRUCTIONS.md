# Instrucciones de Migración - Columna Estado

## Problema Identificado
Las estadísticas del dashboard no mostraban los valores correctos porque la columna `estado` no estaba siendo leída correctamente de la base de datos.

## Solución Implementada

### 1. Código Backend Actualizado
- ✅ Endpoint `/estadisticas` ahora lee correctamente los valores de estado
- ✅ Endpoints de solicitudes ahora incluyen el campo `estado` en las respuestas
- ✅ Lógica para detectar solicitudes canceladas por comentarios `[CANCELADA]`

### 2. Esquema de Base de Datos Actualizado
- ✅ Agregada columna `estado` con valores: `pendiente`, `confirmada`, `en_progreso`, `completada`, `cancelada`
- ✅ Agregada columna `updated_at` para tracking de actualizaciones
- ✅ Índices optimizados para mejor rendimiento

## Pasos para Aplicar la Migración

### Opción 1: Ejecutar Script de Migración (Recomendado)
```sql
-- Ejecutar en Supabase SQL Editor
\i migration_add_estado_column.sql
```

### Opción 2: Ejecutar Comandos Manualmente
```sql
-- 1. Agregar columna estado
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente' 
CHECK (estado IN ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada'));

-- 2. Agregar columna updated_at
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Crear índice para estado
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);

-- 4. Actualizar solicitudes canceladas existentes
UPDATE solicitudes 
SET estado = 'cancelada', updated_at = NOW()
WHERE comentarios LIKE '%[CANCELADA]%' AND estado = 'pendiente';
```

### Opción 3: Recrear Tabla (Solo si no hay datos importantes)
```sql
-- ⚠️ CUIDADO: Esto eliminará todos los datos existentes
DROP TABLE IF EXISTS solicitudes;
\i supabase_schema.sql
```

## Verificación Post-Migración

### 1. Verificar Estructura de Tabla
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'solicitudes' 
ORDER BY ordinal_position;
```

### 2. Verificar Datos
```sql
-- Ver distribución de estados
SELECT estado, COUNT(*) as cantidad 
FROM solicitudes 
GROUP BY estado 
ORDER BY cantidad DESC;

-- Ver solicitudes canceladas
SELECT id, nombre, estado, comentarios 
FROM solicitudes 
WHERE estado = 'cancelada' 
LIMIT 5;
```

### 3. Probar API
```bash
# Probar endpoint de estadísticas
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/admin/estadisticas

# Probar endpoint de solicitudes
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/admin/solicitudes
```

## Resultados Esperados

Después de la migración, el dashboard debería mostrar:
- ✅ **Pendientes**: Solicitudes con `estado = 'pendiente'` o sin estado
- ✅ **Confirmadas**: Solicitudes con `estado = 'confirmada'`
- ✅ **En Progreso**: Solicitudes con `estado = 'en_progreso'`
- ✅ **Completadas**: Solicitudes con `estado = 'completada'`
- ✅ **Canceladas**: Solicitudes con `estado = 'cancelada'` o con `[CANCELADA]` en comentarios

## Notas Importantes

1. **Backup**: Siempre hacer backup antes de ejecutar migraciones
2. **Testing**: Probar en entorno de desarrollo primero
3. **Rollback**: Si algo sale mal, se puede revertir eliminando las columnas agregadas
4. **Compatibilidad**: El código es compatible con tablas que no tengan la columna `estado` (fallback a comentarios)

## Archivos Modificados

- `backend/routers/admin.py` - Lógica de estadísticas y endpoints
- `backend/supabase_schema.sql` - Esquema principal actualizado
- `backend/supabase_schema_simple.sql` - Esquema simplificado actualizado
- `backend/migration_add_estado_column.sql` - Script de migración
- `backend/MIGRATION_INSTRUCTIONS.md` - Este archivo

