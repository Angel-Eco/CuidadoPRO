-- Crear tabla solicitudes para el sistema de enfermería a domicilio
CREATE TABLE IF NOT EXISTS solicitudes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    direccion TEXT NOT NULL,
    tipo_servicio TEXT NOT NULL CHECK (tipo_servicio IN ('curacion', 'control-presion', 'acompanamiento', 'inyecciones', 'otros')),
    fecha_sugerida DATE,
    hora_sugerida TIME,
    comentarios TEXT,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada')),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha ON solicitudes(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_solicitudes_tipo_servicio ON solicitudes(tipo_servicio);
CREATE INDEX IF NOT EXISTS idx_solicitudes_email ON solicitudes(email);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);

-- Comentarios en la tabla
COMMENT ON TABLE solicitudes IS 'Tabla para almacenar solicitudes de servicios de enfermería a domicilio';
COMMENT ON COLUMN solicitudes.id IS 'Identificador único de la solicitud';
COMMENT ON COLUMN solicitudes.nombre IS 'Nombre completo del solicitante';
COMMENT ON COLUMN solicitudes.telefono IS 'Número de teléfono de contacto';
COMMENT ON COLUMN solicitudes.email IS 'Correo electrónico del solicitante';
COMMENT ON COLUMN solicitudes.direccion IS 'Dirección completa donde se requiere el servicio';
COMMENT ON COLUMN solicitudes.tipo_servicio IS 'Tipo de servicio solicitado';
COMMENT ON COLUMN solicitudes.fecha_sugerida IS 'Fecha sugerida para el servicio';
COMMENT ON COLUMN solicitudes.hora_sugerida IS 'Hora sugerida para el servicio';
COMMENT ON COLUMN solicitudes.comentarios IS 'Comentarios adicionales del solicitante';
COMMENT ON COLUMN solicitudes.estado IS 'Estado actual de la solicitud';
COMMENT ON COLUMN solicitudes.fecha IS 'Fecha y hora de creación de la solicitud';
COMMENT ON COLUMN solicitudes.updated_at IS 'Fecha y hora de la última actualización';

-- Habilitar Row Level Security (RLS) para mayor seguridad
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción de nuevas solicitudes (público)
CREATE POLICY "Permitir inserción de solicitudes" ON solicitudes
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura de todas las solicitudes (solo para service key)
CREATE POLICY "Permitir lectura de solicitudes" ON solicitudes
    FOR SELECT USING (true);

-- Política para permitir actualización de solicitudes (solo para service key)
CREATE POLICY "Permitir actualización de solicitudes" ON solicitudes
    FOR UPDATE USING (true);

-- Política para permitir eliminación de solicitudes (solo para service key)
CREATE POLICY "Permitir eliminación de solicitudes" ON solicitudes
    FOR DELETE USING (true);





