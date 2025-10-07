-- Script para actualizar la tabla profesionales con la estructura correcta
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Verificar si la columna foto_url existe, si no, crearla
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 2. Agregar comentario a la columna foto_url
COMMENT ON COLUMN profesionales.foto_url IS 'URL pública de la foto del profesional almacenada en Supabase Storage';

-- 3. Verificar que todas las columnas necesarias existan
-- (Estas columnas deberían existir ya, pero las verificamos)

-- Verificar columna activo
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- Verificar columna orden
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS orden INTEGER DEFAULT 0;

-- Verificar columna created_at
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verificar columna updated_at
ALTER TABLE profesionales 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Agregar constraints si no existen
-- Constraint para experiencia
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profesionales_experiencia_check'
    ) THEN
        ALTER TABLE profesionales 
        ADD CONSTRAINT profesionales_experiencia_check 
        CHECK (experiencia >= 0 AND experiencia <= 50);
    END IF;
END $$;

-- Constraint para descripción
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profesionales_descripcion_check'
    ) THEN
        ALTER TABLE profesionales 
        ADD CONSTRAINT profesionales_descripcion_check 
        CHECK (length(descripcion) >= 10 AND length(descripcion) <= 500);
    END IF;
END $$;

-- Constraint para orden
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profesionales_orden_check'
    ) THEN
        ALTER TABLE profesionales 
        ADD CONSTRAINT profesionales_orden_check 
        CHECK (orden >= 0);
    END IF;
END $$;

-- 5. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_profesionales_activo ON profesionales(activo);
CREATE INDEX IF NOT EXISTS idx_profesionales_orden ON profesionales(orden);
CREATE INDEX IF NOT EXISTS idx_profesionales_especialidad ON profesionales(especialidad);

-- 6. Crear función para actualizar updated_at si no existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Crear trigger para updated_at si no existe
DROP TRIGGER IF EXISTS update_profesionales_updated_at ON profesionales;
CREATE TRIGGER update_profesionales_updated_at 
    BEFORE UPDATE ON profesionales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Configurar RLS (Row Level Security)
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;

-- 9. Crear políticas RLS si no existen
-- Política para lectura pública (solo profesionales activos)
DROP POLICY IF EXISTS "Profesionales activos son visibles públicamente" ON profesionales;
CREATE POLICY "Profesionales activos son visibles públicamente" ON profesionales
    FOR SELECT USING (activo = true);

-- Política para administradores (todas las operaciones)
DROP POLICY IF EXISTS "Administradores pueden gestionar profesionales" ON profesionales;
CREATE POLICY "Administradores pueden gestionar profesionales" ON profesionales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 10. Agregar comentarios a las columnas
COMMENT ON TABLE profesionales IS 'Tabla para almacenar información de profesionales de enfermería';
COMMENT ON COLUMN profesionales.id IS 'Identificador único del profesional';
COMMENT ON COLUMN profesionales.nombre IS 'Nombre completo del profesional';
COMMENT ON COLUMN profesionales.especialidad IS 'Especialidad o área de expertise del profesional';
COMMENT ON COLUMN profesionales.experiencia IS 'Años de experiencia en el campo (0-50)';
COMMENT ON COLUMN profesionales.descripcion IS 'Descripción detallada del profesional y sus servicios (10-500 caracteres)';
COMMENT ON COLUMN profesionales.telefono IS 'Teléfono de contacto del profesional';
COMMENT ON COLUMN profesionales.email IS 'Email de contacto del profesional';
COMMENT ON COLUMN profesionales.imagen_url IS 'URL de la imagen del profesional (legacy)';
COMMENT ON COLUMN profesionales.foto_url IS 'URL pública de la foto del profesional almacenada en Supabase Storage';
COMMENT ON COLUMN profesionales.activo IS 'Indica si el profesional está activo y visible en la página';
COMMENT ON COLUMN profesionales.orden IS 'Orden de aparición en la página web';
COMMENT ON COLUMN profesionales.created_at IS 'Fecha y hora de creación del registro';
COMMENT ON COLUMN profesionales.updated_at IS 'Fecha y hora de última actualización del registro';

-- 11. Verificar la estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profesionales' 
ORDER BY ordinal_position;
