-- Versión simplificada sin Row Level Security
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





