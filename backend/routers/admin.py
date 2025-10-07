from fastapi import APIRouter, HTTPException, Depends, status, Query
from typing import List, Optional
from datetime import datetime, timedelta
from database.connection import get_supabase_client
from models.solicitud import SolicitudResponse, SolicitudUpdate, SolicitudStats
from models.profesional import ProfesionalResponse, ProfesionalListResponse, ProfesionalCreate, ProfesionalUpdate
from auth.middleware import get_manager_or_admin_user
from supabase import Client
import re

router = APIRouter()

def extract_filename_from_url(url: str) -> Optional[str]:
    """
    Extrae el nombre del archivo de una URL de Supabase Storage
    
    Args:
        url: URL completa del archivo en Supabase Storage
        
    Returns:
        Nombre del archivo o None si no se puede extraer
    """
    if not url or "supabase.co/storage" not in url:
        return None
    
    try:
        # Patrón para extraer el nombre del archivo de la URL
        # https://project.supabase.co/storage/v1/object/public/profesionales-fotos/filename.jpg
        pattern = r'/profesionales-fotos/([^/?]+)'
        match = re.search(pattern, url)
        
        if match:
            filename = match.group(1)
            # Limpiar parámetros de query si existen
            filename = filename.split("?")[0]
            return filename
        
        return None
    except Exception as e:
        print(f"Error extrayendo filename de URL: {e}")
        return None

@router.get("/solicitudes", response_model=List[SolicitudResponse])
async def get_all_solicitudes(
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    tipo_servicio: Optional[str] = Query(None, description="Filtrar por tipo de servicio"),
    limit: int = Query(50, description="Número máximo de resultados"),
    offset: int = Query(0, description="Número de resultados a omitir"),
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Get all solicitudes with optional filters."""
    try:
        query = supabase.table("solicitudes").select("*")
        
        # Apply filters
        # if estado:  # Campo estado no existe en la base de datos
        #     query = query.eq("estado", estado)
        if tipo_servicio:
            query = query.eq("tipo_servicio", tipo_servicio)
        
        # Apply pagination and ordering
        result = query.order("fecha", desc=True).range(offset, offset + limit - 1).execute()
        
        solicitudes = []
        for solicitud in result.data:
            # Parse fecha_sugerida if it exists
            fecha_sugerida = None
            if solicitud.get("fecha_sugerida"):
                try:
                    fecha_sugerida = datetime.fromisoformat(solicitud["fecha_sugerida"]).date()
                except:
                    fecha_sugerida = None
            
            # Parse hora_sugerida if it exists
            hora_sugerida = None
            if solicitud.get("hora_sugerida"):
                try:
                    hora_sugerida = datetime.strptime(solicitud["hora_sugerida"], "%H:%M:%S").time()
                except:
                    hora_sugerida = None
            
            # Parse fecha (created_at)
            fecha_creacion = None
            if solicitud.get("fecha"):
                try:
                    fecha_creacion = datetime.fromisoformat(solicitud["fecha"].replace('Z', '+00:00'))
                except:
                    fecha_creacion = datetime.now()
            
            # Determine estado from database or comments
            estado = solicitud.get("estado")
            if estado is None or estado == "":
                # If no estado field, check if it's cancelled by comments
                comentarios = solicitud.get("comentarios", "")
                if "[CANCELADA]" in comentarios:
                    estado = "cancelada"
                else:
                    estado = "pendiente"
            
            solicitudes.append(SolicitudResponse(
                id=solicitud["id"],
                nombre=solicitud["nombre"],
                telefono=solicitud["telefono"],
                email=solicitud["email"],
                direccion=solicitud["direccion"],
                tipo_servicio=solicitud["tipo_servicio"],
                fecha_sugerida=fecha_sugerida,
                hora_sugerida=hora_sugerida,
                comentarios=solicitud.get("comentarios"),
                estado=estado,
                created_at=fecha_creacion,
                updated_at=solicitud.get("updated_at")
            ))
        
        return solicitudes
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener solicitudes: {str(e)}"
        )

@router.get("/solicitudes/{solicitud_id}", response_model=SolicitudResponse)
async def get_solicitud_by_id(
    solicitud_id: str,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Get a specific solicitud by ID."""
    try:
        result = supabase.table("solicitudes").select("*").eq("id", solicitud_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solicitud no encontrada"
            )
        
        solicitud = result.data[0]
        
        # Parse fecha_sugerida if it exists
        fecha_sugerida = None
        if solicitud.get("fecha_sugerida"):
            try:
                fecha_sugerida = datetime.fromisoformat(solicitud["fecha_sugerida"]).date()
            except:
                fecha_sugerida = None
        
        # Parse hora_sugerida if it exists
        hora_sugerida = None
        if solicitud.get("hora_sugerida"):
            try:
                hora_sugerida = datetime.strptime(solicitud["hora_sugerida"], "%H:%M:%S").time()
            except:
                hora_sugerida = None
        
        # Parse fecha (created_at)
        fecha_creacion = None
        if solicitud.get("fecha"):
            try:
                fecha_creacion = datetime.fromisoformat(solicitud["fecha"].replace('Z', '+00:00'))
            except:
                fecha_creacion = datetime.now()
        
        # Determine estado from database or comments
        estado = solicitud.get("estado")
        if estado is None or estado == "":
            # If no estado field, check if it's cancelled by comments
            comentarios = solicitud.get("comentarios", "")
            if "[CANCELADA]" in comentarios:
                estado = "cancelada"
            else:
                estado = "pendiente"
        
        return SolicitudResponse(
            id=solicitud["id"],
            nombre=solicitud["nombre"],
            telefono=solicitud["telefono"],
            email=solicitud["email"],
            direccion=solicitud["direccion"],
            tipo_servicio=solicitud["tipo_servicio"],
            fecha_sugerida=fecha_sugerida,
            hora_sugerida=hora_sugerida,
            comentarios=solicitud.get("comentarios"),
            estado=estado,
            created_at=fecha_creacion,
            updated_at=solicitud.get("updated_at")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener solicitud: {str(e)}"
        )

@router.put("/solicitudes/{solicitud_id}", response_model=dict)
async def update_solicitud_status(
    solicitud_id: str,
    solicitud_update: SolicitudUpdate,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Update solicitud status and admin comments."""
    try:
        # Check if solicitud exists
        existing = supabase.table("solicitudes").select("id").eq("id", solicitud_id).execute()
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solicitud no encontrada"
            )
        
        # Prepare update data
        update_data = {
            "estado": solicitud_update.estado,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if solicitud_update.comentarios_admin:
            update_data["comentarios_admin"] = solicitud_update.comentarios_admin
        
        # Update solicitud
        result = supabase.table("solicitudes").update(update_data).eq("id", solicitud_id).execute()
        
        if result.data:
            return {
                "success": True,
                "message": "Solicitud actualizada exitosamente",
                "data": result.data[0]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudo actualizar la solicitud"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar solicitud: {str(e)}"
        )

@router.get("/estadisticas", response_model=SolicitudStats)
async def get_statistics(
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Get solicitudes statistics for dashboard."""
    try:
        # Get all solicitudes
        result = supabase.table("solicitudes").select("*").execute()
        solicitudes = result.data
        
        # Calculate basic stats
        total = len(solicitudes)
        
        # Count by status - check if estado field exists and has values
        pendientes = 0
        confirmadas = 0
        en_progreso = 0
        completadas = 0
        canceladas = 0
        
        for solicitud in solicitudes:
            estado = solicitud.get("estado")
            if estado is None or estado == "":
                # If no estado field or empty, check if it's cancelled by comments
                comentarios = solicitud.get("comentarios", "")
                if "[CANCELADA]" in comentarios:
                    canceladas += 1
                else:
                    pendientes += 1
            elif estado == "pendiente":
                pendientes += 1
            elif estado == "confirmada":
                confirmadas += 1
            elif estado == "en_progreso":
                en_progreso += 1
            elif estado == "completada":
                completadas += 1
            elif estado == "cancelada":
                canceladas += 1
            else:
                # Unknown status, treat as pending
                pendientes += 1
        
        # Calculate by service type
        por_tipo_servicio = {}
        for solicitud in solicitudes:
            tipo = solicitud.get("tipo_servicio", "otros")
            por_tipo_servicio[tipo] = por_tipo_servicio.get(tipo, 0) + 1
        
        # Calculate by month (last 12 months)
        por_mes = {}
        now = datetime.utcnow()
        for i in range(12):
            month_date = now - timedelta(days=30 * i)
            month_key = month_date.strftime("%Y-%m")
            por_mes[month_key] = 0
        
        for solicitud in solicitudes:
            fecha = datetime.fromisoformat(solicitud["fecha"])
            month_key = fecha.strftime("%Y-%m")
            if month_key in por_mes:
                por_mes[month_key] += 1
        
        return SolicitudStats(
            total=total,
            pendientes=pendientes,
            confirmadas=confirmadas,
            en_progreso=en_progreso,
            completadas=completadas,
            canceladas=canceladas,
            por_tipo_servicio=por_tipo_servicio,
            por_mes=por_mes
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener estadísticas: {str(e)}"
        )

@router.get("/solicitudes-pendientes", response_model=List[SolicitudResponse])
async def get_pending_solicitudes(
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Get all pending solicitudes."""
    try:
        # Como no existe el campo estado, obtenemos todas las solicitudes
        result = supabase.table("solicitudes").select("*").order("fecha", desc=True).execute()
        
        solicitudes = []
        for solicitud in result.data:
            # Parse fecha_sugerida if it exists
            fecha_sugerida = None
            if solicitud.get("fecha_sugerida"):
                try:
                    fecha_sugerida = datetime.fromisoformat(solicitud["fecha_sugerida"]).date()
                except:
                    fecha_sugerida = None
            
            # Parse hora_sugerida if it exists
            hora_sugerida = None
            if solicitud.get("hora_sugerida"):
                try:
                    hora_sugerida = datetime.strptime(solicitud["hora_sugerida"], "%H:%M:%S").time()
                except:
                    hora_sugerida = None
            
            # Parse fecha (created_at)
            fecha_creacion = None
            if solicitud.get("fecha"):
                try:
                    fecha_creacion = datetime.fromisoformat(solicitud["fecha"].replace('Z', '+00:00'))
                except:
                    fecha_creacion = datetime.now()
            
            # Determine estado from database or comments
            estado = solicitud.get("estado")
            if estado is None or estado == "":
                # If no estado field, check if it's cancelled by comments
                comentarios = solicitud.get("comentarios", "")
                if "[CANCELADA]" in comentarios:
                    estado = "cancelada"
                else:
                    estado = "pendiente"
            
            solicitudes.append(SolicitudResponse(
                id=solicitud["id"],
                nombre=solicitud["nombre"],
                telefono=solicitud["telefono"],
                email=solicitud["email"],
                direccion=solicitud["direccion"],
                tipo_servicio=solicitud["tipo_servicio"],
                fecha_sugerida=fecha_sugerida,
                hora_sugerida=hora_sugerida,
                comentarios=solicitud.get("comentarios"),
                estado=estado,
                created_at=fecha_creacion,
                updated_at=solicitud.get("updated_at")
            ))
        
        return solicitudes
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener solicitudes pendientes: {str(e)}"
        )

@router.delete("/solicitudes/{solicitud_id}")
async def delete_solicitud(
    solicitud_id: str,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Delete a solicitud (soft delete by changing status to cancelled)."""
    try:
        # Check if solicitud exists
        existing = supabase.table("solicitudes").select("id").eq("id", solicitud_id).execute()
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solicitud no encontrada"
            )
        
        # Soft delete by adding cancellation note to comments
        existing_solicitud = supabase.table("solicitudes").select("comentarios").eq("id", solicitud_id).execute()
        current_comments = existing_solicitud.data[0]["comentarios"] if existing_solicitud.data else ""
        
        cancellation_note = "[CANCELADA] Solicitud cancelada por el administrador"
        new_comments = f"{cancellation_note}\n{current_comments}" if current_comments else cancellation_note
        
        result = supabase.table("solicitudes").update({
            "comentarios": new_comments
        }).eq("id", solicitud_id).execute()
        
        if result.data:
            return {
                "success": True,
                "message": "Solicitud cancelada exitosamente"
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudo cancelar la solicitud"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al cancelar solicitud: {str(e)}"
        )

@router.get("/profesionales", response_model=ProfesionalListResponse)
async def get_all_profesionales(
    activo: Optional[bool] = Query(None, description="Filtrar por estado activo"),
    especialidad: Optional[str] = Query(None, description="Filtrar por especialidad"),
    limit: int = Query(50, description="Número máximo de resultados"),
    offset: int = Query(0, description="Número de resultados a omitir"),
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Get all profesionales with optional filters."""
    try:
        # Construir query base
        query = supabase.table("profesionales").select("*")
        
        # Aplicar filtros
        if activo is not None:
            query = query.eq("activo", activo)
        
        if especialidad:
            query = query.eq("especialidad", especialidad)
        
        # Ordenar por orden y luego por nombre
        query = query.order("orden", desc=False).order("nombre", desc=False)
        
        # Aplicar paginación
        query = query.range(offset, offset + limit - 1)
        
        result = query.execute()
        
        if result.data is None:
            return ProfesionalListResponse(profesionales=[], total=0)
        
        # Contar total para paginación
        count_query = supabase.table("profesionales").select("*", count="exact")
        if activo is not None:
            count_query = count_query.eq("activo", activo)
        if especialidad:
            count_query = count_query.eq("especialidad", especialidad)
        
        count_result = count_query.execute()
        total = count_result.count or 0
        
        profesionales = [ProfesionalResponse(**prof) for prof in result.data]
        
        return ProfesionalListResponse(
            profesionales=profesionales,
            total=total
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener profesionales: {str(e)}"
        )

@router.post("/profesionales", response_model=ProfesionalResponse)
async def create_profesional(
    profesional: ProfesionalCreate,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Create a new profesional."""
    try:
        print(f"📝 Creando profesional con datos: {profesional.model_dump()}")
        
        # Validar datos antes de insertar
        data_to_insert = profesional.model_dump()
        print(f"📊 Datos a insertar: {data_to_insert}")
        
        # Verificar que no haya campos None que puedan causar problemas
        cleaned_data = {k: v for k, v in data_to_insert.items() if v is not None}
        print(f"🧹 Datos limpiados: {cleaned_data}")
        
        result = supabase.table("profesionales").insert(cleaned_data).execute()
        
        print(f"📤 Resultado de inserción: {result}")
        
        if result.data:
            return ProfesionalResponse(**result.data[0])
        else:
            print(f"❌ No se devolvieron datos en la inserción")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudo crear el profesional"
            )
    except HTTPException as he:
        print(f"❌ HTTPException: {he.detail}")
        raise
    except Exception as e:
        print(f"❌ Error al crear profesional: {str(e)}")
        print(f"❌ Tipo de error: {type(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear profesional: {str(e)}"
        )

@router.put("/profesionales/{profesional_id}", response_model=ProfesionalResponse)
async def update_profesional(
    profesional_id: str,
    profesional: ProfesionalUpdate,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Update a profesional."""
    try:
        # Filtrar campos None del update
        update_data = {k: v for k, v in profesional.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay datos para actualizar"
            )
        
        result = supabase.table("profesionales").update(update_data).eq("id", profesional_id).execute()
        
        if result.data:
            return ProfesionalResponse(**result.data[0])
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar profesional: {str(e)}"
        )

@router.delete("/profesionales/{profesional_id}")
async def delete_profesional(
    profesional_id: str,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Delete a profesional and their photo from storage."""
    try:
        print(f"🗑️ Eliminando profesional: {profesional_id}")
        
        # Primero obtener los datos del profesional para acceder a la foto
        profesional_data = supabase.table("profesionales").select("foto_url, nombre").eq("id", profesional_id).execute()
        
        if not profesional_data.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
        
        profesional = profesional_data.data[0]
        foto_url = profesional.get("foto_url")
        nombre = profesional.get("nombre", "profesional")
        
        print(f"📸 Foto URL del profesional: {foto_url}")
        
        # Eliminar la foto del storage si existe
        if foto_url:
            filename = extract_filename_from_url(foto_url)
            
            if filename:
                try:
                    print(f"📁 Eliminando archivo del storage: {filename}")
                    
                    # Eliminar archivo del storage
                    storage_result = supabase.storage.from_("profesionales-fotos").remove([filename])
                    
                    if storage_result.get("error"):
                        print(f"⚠️ Error al eliminar archivo del storage: {storage_result['error']}")
                        # No fallar la eliminación del profesional si falla la eliminación del archivo
                    else:
                        print(f"✅ Archivo eliminado del storage: {filename}")
                        
                except Exception as e:
                    print(f"⚠️ Error al eliminar archivo del storage: {str(e)}")
                    # No fallar la eliminación del profesional si falla la eliminación del archivo
            else:
                print(f"⚠️ No se pudo extraer el nombre del archivo de la URL: {foto_url}")
        
        # Eliminar el profesional de la base de datos
        result = supabase.table("profesionales").delete().eq("id", profesional_id).execute()
        
        if result.data:
            print(f"✅ Profesional eliminado: {nombre}")
            return {"success": True, "message": "Profesional eliminado exitosamente"}
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error al eliminar profesional: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar profesional: {str(e)}"
        )

@router.post("/test-delete-profesional/{profesional_id}")
async def test_delete_profesional(
    profesional_id: str,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Test endpoint para verificar la funcionalidad de eliminación sin eliminar realmente."""
    try:
        print(f"🧪 Test de eliminación para profesional: {profesional_id}")
        
        # Obtener datos del profesional
        profesional_data = supabase.table("profesionales").select("foto_url, nombre").eq("id", profesional_id).execute()
        
        if not profesional_data.data:
            return {"error": "Profesional no encontrado"}
        
        profesional = profesional_data.data[0]
        foto_url = profesional.get("foto_url")
        nombre = profesional.get("nombre", "profesional")
        
        result = {
            "profesional_id": profesional_id,
            "nombre": nombre,
            "foto_url": foto_url,
            "filename_extracted": None,
            "storage_operation": None
        }
        
        # Probar extracción de filename
        if foto_url:
            filename = extract_filename_from_url(foto_url)
            result["filename_extracted"] = filename
            
            if filename:
                # Probar operación de storage (sin eliminar realmente)
                try:
                    # Solo verificar que el archivo existe
                    files = supabase.storage.from_("profesionales-fotos").list()
                    file_exists = any(f.get("name") == filename for f in files)
                    result["storage_operation"] = {
                        "file_exists": file_exists,
                        "total_files_in_bucket": len(files)
                    }
                except Exception as e:
                    result["storage_operation"] = {"error": str(e)}
        
        return result
        
    except Exception as e:
        return {"error": str(e)}

@router.get("/profesionales/{profesional_id}", response_model=ProfesionalResponse)
async def get_profesional_by_id(
    profesional_id: str,
    current_user: dict = Depends(get_manager_or_admin_user),
    supabase: Client = Depends(get_supabase_client)
):
    """Get a profesional by ID."""
    try:
        result = supabase.table("profesionales").select("*").eq("id", profesional_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
        
        return ProfesionalResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener profesional: {str(e)}"
        )

@router.get("/test-profesionales")
async def test_profesionales_table(
    supabase: Client = Depends(get_supabase_client)
):
    """Test endpoint to check if profesionales table exists and has data."""
    try:
        # Try to get all data from profesionales table
        result = supabase.table("profesionales").select("*").limit(5).execute()
        
        return {
            "success": True,
            "table_exists": True,
            "data_count": len(result.data) if result.data else 0,
            "sample_data": result.data[:2] if result.data else [],
            "message": f"Tabla profesionales existe y tiene {len(result.data) if result.data else 0} registros"
        }
        
    except Exception as e:
        return {
            "success": False,
            "table_exists": False,
            "error": str(e),
            "message": "Error al acceder a la tabla profesionales. Verifica que la tabla existe en Supabase."
        }

@router.post("/test-profesional-validation")
async def test_profesional_validation(
    profesional_data: dict
):
    """Test endpoint to validate profesional data without inserting."""
    try:
        print(f"🧪 Probando validación con datos: {profesional_data}")
        
        # Intentar crear el modelo
        profesional = ProfesionalCreate(**profesional_data)
        
        print(f"✅ Validación exitosa: {profesional.model_dump()}")
        
        return {
            "success": True,
            "message": "Datos válidos",
            "validated_data": profesional.model_dump()
        }
        
    except Exception as e:
        print(f"❌ Error de validación: {str(e)}")
        return {
            "success": False,
            "message": f"Error de validación: {str(e)}",
            "error_type": str(type(e).__name__)
        }

@router.post("/test-profesional-insert")
async def test_profesional_insert(
    profesional_data: dict,
    supabase: Client = Depends(get_supabase_client)
):
    """Test endpoint to insert profesional data and see what happens."""
    try:
        print(f"🧪 Probando inserción con datos: {profesional_data}")
        
        # Intentar crear el modelo
        profesional = ProfesionalCreate(**profesional_data)
        data_to_insert = profesional.model_dump()
        
        print(f"📊 Datos a insertar: {data_to_insert}")
        
        # Limpiar datos None
        cleaned_data = {k: v for k, v in data_to_insert.items() if v is not None}
        print(f"🧹 Datos limpiados: {cleaned_data}")
        
        # Intentar insertar
        result = supabase.table("profesionales").insert(cleaned_data).execute()
        
        print(f"📤 Resultado de inserción: {result}")
        
        if result.data:
            # Eliminar el registro de prueba
            supabase.table("profesionales").delete().eq("id", result.data[0]["id"]).execute()
            print(f"🗑️ Registro de prueba eliminado")
            
            return {
                "success": True,
                "message": "Inserción exitosa",
                "inserted_data": result.data[0]
            }
        else:
            return {
                "success": False,
                "message": "No se devolvieron datos en la inserción",
                "result": str(result)
            }
        
    except Exception as e:
        print(f"❌ Error en inserción de prueba: {str(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "message": f"Error en inserción: {str(e)}",
            "error_type": str(type(e).__name__)
        }
