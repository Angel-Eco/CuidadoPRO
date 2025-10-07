-- Script para recrear la tabla profesionales desde cero
-- ⚠️ ADVERTENCIA: Este script eliminará todos los datos existentes
-- Solo úsalo si la tabla está muy corrupta o necesitas empezar de cero

-- 1. Eliminar la tabla existente (CUIDADO: Esto borra todos los datos)
DROP TABLE IF EXISTS profesionales CASCADE;

-- 2. Crear la tabla con la estructura correcta
CREATE TABLE profesionales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    experiencia INTEGER NOT NULL CHECK (experiencia >= 0 AND experiencia <= 50),
    descripcion TEXT NOT NULL CHECK (length(descripcion) >= 10 AND length(descripcion) <= 500),
    telefono VARCHAR(20),
    email VARCHAR(100),
    imagen_url TEXT, -- Columna legacy
    foto_url TEXT,   -- Nueva columna para Supabase Storage
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0 CHECK (orden >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear índices para optimizar consultas
CREATE INDEX idx_profesionales_activo ON profesionales(activo);
CREATE INDEX idx_profesionales_orden ON profesionales(orden);
CREATE INDEX idx_profesionales_especialidad ON profesionales(especialidad);

-- 4. Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para updated_at
CREATE TRIGGER update_profesionales_updated_at 
    BEFORE UPDATE ON profesionales 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Configurar RLS (Row Level Security)
ALTER TABLE profesionales ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS
-- Política para lectura pública (solo profesionales activos)
CREATE POLICY "Profesionales activos son visibles públicamente" ON profesionales
    FOR SELECT USING (activo = true);

-- Política para administradores (todas las operaciones)
CREATE POLICY "Administradores pueden gestionar profesionales" ON profesionales
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- 8. Agregar comentarios
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

-- 9. Insertar datos de ejemplo
INSERT INTO profesionales (nombre, especialidad, experiencia, descripcion, telefono, email, foto_url, orden) VALUES
(
    'María González',
    'Enfermería General',
    8,
    'Especialista en cuidados domiciliarios con amplia experiencia en atención a pacientes crónicos y post-operatorios.',
    '+56912345678',
    'maria.gonzalez@enfermeria.cl',
    'https://example.com/maria-enfermera.jpg',
    1
),
(
    'Carlos Rodríguez',
    'Enfermería Geriátrica',
    12,
    'Experto en cuidados de adultos mayores, especializado en demencia y enfermedades crónicas.',
    '+56987654321',
    'carlos.rodriguez@enfermeria.cl',
    'https://example.com/carlos-enfermero.jpg',
    2
),
(
    'Ana Martínez',
    'Enfermería Pediátrica',
    6,
    'Especialista en cuidados infantiles, con experiencia en neonatología y pediatría general.',
    '+56911223344',
    'ana.martinez@enfermeria.cl',
    'https://example.com/ana-enfermera.jpg',
    3
);

-- 10. Verificar la estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profesionales' 
ORDER BY ordinal_position;
