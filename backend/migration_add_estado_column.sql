-- Migración para agregar columnas estado y updated_at a la tabla solicitudes
-- Ejecutar este script en Supabase para actualizar la estructura de la tabla

-- Agregar columna estado
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente' 
CHECK (estado IN ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada'));

-- Agregar columna updated_at
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear índice para la columna estado para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);

-- Comentarios para las nuevas columnas
COMMENT ON COLUMN solicitudes.estado IS 'Estado actual de la solicitud';
COMMENT ON COLUMN solicitudes.updated_at IS 'Fecha y hora de la última actualización';

-- Actualizar solicitudes existentes que tienen [CANCELADA] en comentarios
UPDATE solicitudes 
SET estado = 'cancelada', updated_at = NOW()
WHERE comentarios LIKE '%[CANCELADA]%' AND estado = 'pendiente';

