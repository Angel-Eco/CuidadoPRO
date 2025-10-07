-- Script para verificar el estado actual de la tabla profesionales
-- Ejecuta este script en el SQL Editor de Supabase para diagnosticar problemas

-- 1. Verificar si la tabla existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profesionales')
        THEN '✅ Tabla profesionales existe'
        ELSE '❌ Tabla profesionales NO existe'
    END as tabla_status;

-- 2. Verificar estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'foto_url' THEN '✅ Columna foto_url existe'
        WHEN column_name = 'imagen_url' THEN '⚠️ Columna imagen_url (legacy)'
        ELSE '📋 Columna estándar'
    END as status
FROM information_schema.columns 
WHERE table_name = 'profesionales' 
ORDER BY ordinal_position;

-- 3. Verificar constraints
SELECT 
    constraint_name,
    constraint_type,
    CASE 
        WHEN constraint_name LIKE '%experiencia%' THEN '✅ Constraint experiencia'
        WHEN constraint_name LIKE '%descripcion%' THEN '✅ Constraint descripción'
        WHEN constraint_name LIKE '%orden%' THEN '✅ Constraint orden'
        ELSE '📋 Otro constraint'
    END as status
FROM information_schema.table_constraints 
WHERE table_name = 'profesionales';

-- 4. Verificar índices
SELECT 
    indexname,
    indexdef,
    CASE 
        WHEN indexname LIKE '%activo%' THEN '✅ Índice activo'
        WHEN indexname LIKE '%orden%' THEN '✅ Índice orden'
        WHEN indexname LIKE '%especialidad%' THEN '✅ Índice especialidad'
        ELSE '📋 Otro índice'
    END as status
FROM pg_indexes 
WHERE tablename = 'profesionales';

-- 5. Verificar RLS (Row Level Security)
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS habilitado'
        ELSE '❌ RLS deshabilitado'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'profesionales';

-- 6. Verificar políticas RLS
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    CASE 
        WHEN policyname LIKE '%activos%' THEN '✅ Política lectura pública'
        WHEN policyname LIKE '%administradores%' THEN '✅ Política administradores'
        ELSE '📋 Otra política'
    END as policy_status
FROM pg_policies 
WHERE tablename = 'profesionales';

-- 7. Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    CASE 
        WHEN trigger_name LIKE '%updated_at%' THEN '✅ Trigger updated_at'
        ELSE '📋 Otro trigger'
    END as trigger_status
FROM information_schema.triggers 
WHERE event_object_table = 'profesionales';

-- 8. Contar registros existentes
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN activo = true THEN 1 END) as registros_activos,
    COUNT(CASE WHEN foto_url IS NOT NULL THEN 1 END) as con_foto_url,
    COUNT(CASE WHEN imagen_url IS NOT NULL THEN 1 END) as con_imagen_url
FROM profesionales;

-- 9. Verificar datos de ejemplo
SELECT 
    id,
    nombre,
    especialidad,
    experiencia,
    CASE 
        WHEN LENGTH(descripcion) < 10 THEN '❌ Descripción muy corta'
        WHEN LENGTH(descripcion) > 500 THEN '❌ Descripción muy larga'
        ELSE '✅ Descripción OK'
    END as descripcion_status,
    CASE 
        WHEN telefono IS NULL OR telefono = '' THEN '⚠️ Sin teléfono'
        ELSE '✅ Con teléfono'
    END as telefono_status,
    CASE 
        WHEN email IS NULL OR email = '' THEN '⚠️ Sin email'
        WHEN email NOT LIKE '%@%' THEN '❌ Email inválido'
        ELSE '✅ Email OK'
    END as email_status,
    CASE 
        WHEN foto_url IS NOT NULL THEN '✅ Con foto_url'
        WHEN imagen_url IS NOT NULL THEN '⚠️ Solo imagen_url (legacy)'
        ELSE '❌ Sin imagen'
    END as imagen_status
FROM profesionales 
LIMIT 5;

-- 10. Resumen de problemas encontrados
SELECT 
    'RESUMEN DE DIAGNÓSTICO' as diagnostico,
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profesionales')
        THEN '❌ PROBLEMA CRÍTICO: Tabla no existe'
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profesionales' AND column_name = 'foto_url')
        THEN '⚠️ PROBLEMA: Columna foto_url no existe'
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name = 'profesionales' AND constraint_name LIKE '%experiencia%')
        THEN '⚠️ PROBLEMA: Constraint de experiencia no existe'
        WHEN NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profesionales' AND rowsecurity = true)
        THEN '⚠️ PROBLEMA: RLS no habilitado'
        ELSE '✅ Tabla parece estar correctamente configurada'
    END as resultado;
