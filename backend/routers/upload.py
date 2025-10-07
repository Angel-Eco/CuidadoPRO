from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from supabase import create_client, Client
import os
import uuid
from datetime import datetime
from typing import Optional

router = APIRouter()

# Configuración de Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar configurados")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Configuración de archivos permitidos
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def validate_image_file(file: UploadFile) -> None:
    """Valida que el archivo sea una imagen válida"""
    # Verificar extensión
    file_extension = os.path.splitext(file.filename.lower())[1]
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no permitido. Extensiones permitidas: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Verificar tamaño (se verificará después de leer el archivo)
    if hasattr(file, 'size') and file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Archivo muy grande. Tamaño máximo permitido: {MAX_FILE_SIZE // (1024*1024)}MB"
        )

def generate_unique_filename(original_filename: str) -> str:
    """Genera un nombre de archivo único"""
    file_extension = os.path.splitext(original_filename)[1]
    unique_id = str(uuid.uuid4())
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"profesional_{timestamp}_{unique_id}{file_extension}"

@router.post("/upload/profesional-foto")
async def upload_profesional_foto(
    file: UploadFile = File(...)
):
    """
    Sube una foto de profesional a Supabase Storage
    
    Args:
        file: Archivo de imagen a subir
        
    Returns:
        JSON con la URL pública de la imagen subida
    """
    try:
        # Validar archivo
        validate_image_file(file)
        
        # Leer contenido del archivo
        content = await file.read()
        
        # Verificar que el contenido sea bytes
        if not isinstance(content, bytes):
            print(f"❌ Error: El contenido no es bytes, es {type(content)}")
            raise HTTPException(
                status_code=400,
                detail=f"Error al leer el archivo: contenido no válido"
            )
        
        # Verificar tamaño después de leer
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Archivo muy grande. Tamaño máximo permitido: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Generar nombre único
        filename = generate_unique_filename(file.filename)
        # Subir a Supabase Storage
        try:
            # Intentar subir el archivo
            result = supabase.storage.from_("profesionales-fotos").upload(
                filename,
                content,
                file_options={
                    "content-type": file.content_type,
                    "cache-control": "3600"
                }
            )
            
            # Verificar si hay errores en la respuesta
            if hasattr(result, 'error') and result.error:
                print(f"❌ Error en resultado: {result.error}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Error al subir archivo: {result.error}"
                )
            
            # Verificar si la respuesta es un diccionario con error
            if isinstance(result, dict) and result.get("error"):
                print(f"❌ Error en diccionario: {result['error']}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Error al subir archivo: {result['error']}"
                )
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Error al subir archivo: {str(e)}")
            print(f"❌ Tipo de error: {type(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error al subir archivo a Supabase: {str(e)}"
            )
        
        # Obtener URL pública
        try:
            public_url = supabase.storage.from_("profesionales-fotos").get_public_url(filename)
            
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Foto subida exitosamente",
                    "data": {
                        "filename": filename,
                        "url": public_url,
                        "size": len(content),
                        "content_type": file.content_type
                    }
                }
            )
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al obtener URL pública: {str(e)}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.delete("/upload/profesional-foto/{filename}")
async def delete_profesional_foto(filename: str):
    """
    Elimina una foto de profesional de Supabase Storage
    
    Args:
        filename: Nombre del archivo a eliminar
        
    Returns:
        JSON con confirmación de eliminación
    """
    try:
        # Eliminar archivo de Supabase Storage
        result = supabase.storage.from_("profesionales-fotos").remove([filename])
        
        if result.get("error"):
            raise HTTPException(
                status_code=500,
                detail=f"Error al eliminar archivo: {result['error']}"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": f"Archivo {filename} eliminado exitosamente"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.get("/upload/profesional-foto/{filename}")
async def get_profesional_foto(filename: str):
    """
    Obtiene información de una foto de profesional
    
    Args:
        filename: Nombre del archivo
        
    Returns:
        JSON con información del archivo
    """
    try:
        # Obtener URL pública
        public_url = supabase.storage.from_("profesionales-fotos").get_public_url(filename)
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "data": {
                    "filename": filename,
                    "url": public_url
                }
            }
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener información del archivo: {str(e)}"
        )

@router.get("/upload/test")
async def test_upload_connection():
    """
    Endpoint de prueba para verificar la conexión con Supabase Storage
    """
    try:
        print("🧪 Probando conexión con Supabase Storage...")
        
        # Verificar que el cliente de Supabase esté configurado
        if not supabase:
            raise HTTPException(
                status_code=500,
                detail="Cliente de Supabase no configurado"
            )
        
        # Intentar listar buckets
        try:
            buckets = supabase.storage.list_buckets()
            print(f"📦 Buckets encontrados: {len(buckets)}")
            
            bucket_names = [bucket.name for bucket in buckets]
            print(f"📦 Nombres de buckets: {bucket_names}")
            
            # Verificar si existe el bucket profesionales-fotos
            if 'profesionales-fotos' in bucket_names:
                print("✅ Bucket 'profesionales-fotos' encontrado")
                bucket_exists = True
            else:
                print("❌ Bucket 'profesionales-fotos' no encontrado")
                bucket_exists = False
            
        except Exception as e:
            print(f"❌ Error al listar buckets: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error al conectar con Supabase Storage: {str(e)}"
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Conexión con Supabase Storage exitosa",
                "data": {
                    "buckets_count": len(buckets),
                    "bucket_names": bucket_names,
                    "profesionales_fotos_exists": bucket_exists
                }
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en test de conexión: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno: {str(e)}"
        )

@router.post("/upload/test-simple")
async def test_simple_upload(file: UploadFile = File(...)):
    """
    Endpoint de prueba simple para subir un archivo
    """
    try:
        print(f"🧪 Prueba simple - Archivo: {file.filename}")
        
        # Leer contenido
        content = await file.read()
        print(f"📊 Contenido leído: {len(content)} bytes, tipo: {type(content)}")
        
        # Verificar que sea bytes
        if not isinstance(content, bytes):
            raise HTTPException(
                status_code=400,
                detail=f"Contenido no es bytes: {type(content)}"
            )
        
        # Crear un nombre simple
        filename = f"test_{file.filename}"
        
        # Intentar subir a un bucket existente (usar el primer bucket disponible)
        try:
            buckets = supabase.storage.list_buckets()
            if not buckets:
                raise HTTPException(
                    status_code=500,
                    detail="No hay buckets disponibles"
                )
            
            # Usar el primer bucket disponible
            bucket_name = buckets[0].name
            print(f"📦 Usando bucket: {bucket_name}")
            
            result = supabase.storage.from_(bucket_name).upload(
                filename,
                content,
                file_options={
                    "content-type": file.content_type or "application/octet-stream"
                }
            )
            
            # Limpiar archivo de prueba
            supabase.storage.from_(bucket_name).remove([filename])
            
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "message": "Prueba de subida exitosa",
                    "data": {
                        "filename": filename,
                        "bucket": bucket_name,
                        "size": len(content)
                    }
                }
            )
            
        except Exception as e:
            print(f"❌ Error en subida de prueba: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error en subida de prueba: {str(e)}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error inesperado: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )
