# Configuración de Supabase Storage para Fotos de Profesionales

## Configuración del Bucket

Para que la funcionalidad de subida de fotos funcione correctamente, necesitas configurar un bucket en Supabase Storage.

### 1. Crear el Bucket

1. Ve a tu proyecto de Supabase
2. Navega a **Storage** en el menú lateral
3. Haz clic en **New bucket**
4. Configura el bucket con los siguientes parámetros:
   - **Name**: `profesionales-fotos`
   - **Public**: ✅ **Marcado** (para permitir acceso público a las imágenes)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### 2. Configurar Políticas de Seguridad (RLS)

Después de crear el bucket, necesitas configurar las políticas de Row Level Security:

#### Política para INSERT (Subir archivos)
```sql
CREATE POLICY "Permitir subida de fotos de profesionales" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profesionales-fotos' AND
  auth.role() = 'service_role'
);
```

#### Política para SELECT (Leer archivos)
```sql
CREATE POLICY "Permitir lectura pública de fotos de profesionales" ON storage.objects
FOR SELECT USING (bucket_id = 'profesionales-fotos');
```

#### Política para DELETE (Eliminar archivos)
```sql
CREATE POLICY "Permitir eliminación de fotos de profesionales" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profesionales-fotos' AND
  auth.role() = 'service_role'
);
```

### 3. Verificar Configuración

Para verificar que todo está configurado correctamente:

1. **Bucket creado**: Debe aparecer en la lista de buckets como `profesionales-fotos`
2. **Políticas activas**: Ve a **Storage** → **Policies** y verifica que las políticas estén activas
3. **Permisos públicos**: El bucket debe estar marcado como público

### 4. Variables de Entorno

Asegúrate de que tu archivo `.env` contenga:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-role-key
```

**Importante**: Usa el `service_role` key, no el `anon` key, ya que necesitas permisos de administrador para subir archivos.

### 5. Estructura de Archivos

Los archivos se subirán con el siguiente formato:
```
profesionales-fotos/
├── profesional_20241201_143022_uuid1.jpg
├── profesional_20241201_143045_uuid2.png
└── ...
```

### 6. URLs Públicas

Las imágenes serán accesibles públicamente a través de URLs como:
```
https://tu-proyecto.supabase.co/storage/v1/object/public/profesionales-fotos/profesional_20241201_143022_uuid1.jpg
```

## Solución de Problemas

### Error: "Bucket not found"
- Verifica que el bucket `profesionales-fotos` existe
- Asegúrate de que el nombre sea exactamente `profesionales-fotos`

### Error: "Permission denied"
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de usar el `service_role` key en las variables de entorno

### Error: "File too large"
- Verifica que el límite de tamaño del bucket sea de 5MB o más
- El código valida archivos de máximo 5MB

### Error: "Invalid file type"
- Verifica que los tipos MIME permitidos incluyan: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

## Testing

Para probar la funcionalidad:

1. Inicia el backend: `uvicorn main:app --reload`
2. Ve al panel de administración
3. Intenta crear un nuevo profesional con una foto
4. Verifica que la imagen se suba correctamente y aparezca en el bucket de Supabase
