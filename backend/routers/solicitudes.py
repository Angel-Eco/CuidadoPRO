from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.exceptions import RequestValidationError
from typing import List
from database.connection import get_supabase_client
from models.solicitud import SolicitudCreate, SolicitudResponse
from supabase import Client
import logging

router = APIRouter()

@router.post("/solicitud", response_model=dict)
async def crear_solicitud(
    solicitud: SolicitudCreate,
    supabase: Client = Depends(get_supabase_client)
):
    """Create a new solicitud."""
    try:
        # Log the received data for debugging
        logging.info(f"Received solicitud data: {solicitud.dict()}")
        
        # Prepare data for insertion
        solicitud_data = {
            "nombre": solicitud.nombre,
            "telefono": solicitud.telefono,
            "email": solicitud.email,
            "direccion": solicitud.direccion,
            "tipo_servicio": solicitud.tipo_servicio,
            "comentarios": solicitud.comentarios
        }
        
        # Add optional fields if provided
        if solicitud.fecha_sugerida:
            if hasattr(solicitud.fecha_sugerida, 'isoformat'):
                solicitud_data["fecha_sugerida"] = solicitud.fecha_sugerida.isoformat()
            else:
                solicitud_data["fecha_sugerida"] = str(solicitud.fecha_sugerida)
        
        if solicitud.hora_sugerida:
            if hasattr(solicitud.hora_sugerida, 'isoformat'):
                solicitud_data["hora_sugerida"] = solicitud.hora_sugerida.isoformat()
            else:
                solicitud_data["hora_sugerida"] = str(solicitud.hora_sugerida)
        
        logging.info(f"Prepared data for insertion: {solicitud_data}")
        
        result = supabase.table("solicitudes").insert(solicitud_data).execute()
        
        if result.data:
            return {
                "success": True,
                "message": "Solicitud creada exitosamente",
                "data": result.data[0]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudo crear la solicitud"
            )
    except RequestValidationError as e:
        logging.error(f"Validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Error de validación: {str(e)}"
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear la solicitud: {str(e)}"
        )

@router.get("/solicitudes", response_model=dict)
async def listar_solicitudes(
    supabase: Client = Depends(get_supabase_client)
):
    """Get all solicitudes."""
    try:
        result = supabase.table("solicitudes").select("*").order("fecha", desc=True).execute()
        
        return {
            "success": True,
            "data": result.data
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Error al obtener las solicitudes: {str(e)}"
        }
