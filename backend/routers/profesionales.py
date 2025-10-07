from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from database.connection import get_supabase_client
from models.profesional import ProfesionalCreate, ProfesionalUpdate, ProfesionalResponse, ProfesionalListResponse
from auth.middleware import get_current_user
import uuid

router = APIRouter()

@router.get("", response_model=ProfesionalListResponse)
async def get_profesionales(
    activo: Optional[bool] = None,
    especialidad: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user)
):
    """Obtener lista de profesionales con filtros opcionales"""
    try:
        supabase = get_supabase_client()
        
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
        print(f"Error getting profesionales: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener profesionales"
        )

@router.get("/{profesional_id}", response_model=ProfesionalResponse)
async def get_profesional(profesional_id: str):
    """Obtener un profesional específico por ID"""
    try:
        supabase = get_supabase_client()
        
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
        print(f"Error getting profesional: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener profesional"
        )

@router.post("/", response_model=ProfesionalResponse)
async def create_profesional(
    profesional: ProfesionalCreate,
    current_user: dict = Depends(get_current_user)
):
    """Crear un nuevo profesional (solo administradores)"""
    try:
        supabase = get_supabase_client()
        
        # Verificar que el usuario sea admin
        if current_user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden crear profesionales"
            )
        
        # Preparar datos para inserción
        profesional_data = profesional.dict()
        profesional_data["id"] = str(uuid.uuid4())
        
        result = supabase.table("profesionales").insert(profesional_data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear profesional"
            )
        
        return ProfesionalResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating profesional: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear profesional"
        )

@router.put("/{profesional_id}", response_model=ProfesionalResponse)
async def update_profesional(
    profesional_id: str,
    profesional: ProfesionalUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Actualizar un profesional existente (solo administradores)"""
    try:
        supabase = get_supabase_client()
        
        # Verificar que el usuario sea admin
        if current_user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden actualizar profesionales"
            )
        
        # Verificar que el profesional existe
        existing = supabase.table("profesionales").select("*").eq("id", profesional_id).execute()
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
        
        # Preparar datos para actualización (solo campos no nulos)
        update_data = {k: v for k, v in profesional.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay datos para actualizar"
            )
        
        result = supabase.table("profesionales").update(update_data).eq("id", profesional_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al actualizar profesional"
            )
        
        return ProfesionalResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating profesional: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al actualizar profesional"
        )

@router.delete("/{profesional_id}")
async def delete_profesional(
    profesional_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Eliminar un profesional (solo administradores)"""
    try:
        supabase = get_supabase_client()
        
        # Verificar que el usuario sea admin
        if current_user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden eliminar profesionales"
            )
        
        # Verificar que el profesional existe
        existing = supabase.table("profesionales").select("*").eq("id", profesional_id).execute()
        if not existing.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profesional no encontrado"
            )
        
        # Eliminar profesional
        result = supabase.table("profesionales").delete().eq("id", profesional_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al eliminar profesional"
            )
        
        return {"message": "Profesional eliminado exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting profesional: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al eliminar profesional"
        )

@router.get("/public/activos", response_model=List[ProfesionalResponse])
async def get_profesionales_activos():
    """Obtener solo profesionales activos para mostrar en la página pública"""
    try:
        supabase = get_supabase_client()
        
        result = supabase.table("profesionales").select("*").eq("activo", True).order("orden", desc=False).order("nombre", desc=False).execute()
        
        if result.data is None:
            return []
        
        profesionales = [ProfesionalResponse(**prof) for prof in result.data]
        
        return profesionales
        
    except Exception as e:
        print(f"Error getting active profesionales: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener profesionales activos"
        )
