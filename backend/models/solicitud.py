from pydantic import BaseModel, Field, validator
from typing import Optional, Union
from datetime import datetime, time, date

class SolicitudBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre completo del cliente")
    telefono: str = Field(..., min_length=8, max_length=20, description="Teléfono de contacto")
    email: str = Field(..., max_length=100, description="Email de contacto")
    direccion: str = Field(..., min_length=10, max_length=200, description="Dirección del servicio")
    tipo_servicio: str = Field(..., min_length=2, max_length=100, description="Tipo de servicio solicitado")
    comentarios: Optional[str] = Field(None, max_length=500, description="Comentarios adicionales")
    estado: Optional[str] = Field(None, description="Estado de la solicitud")
    fecha_sugerida: Optional[Union[datetime, date, str]] = Field(None, description="Fecha sugerida para el servicio")
    hora_sugerida: Optional[Union[time, str]] = Field(None, description="Hora sugerida para el servicio")

    @validator('email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Email debe ser válido')
        return v

    @validator('telefono')
    def validate_telefono(cls, v):
        if v and not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Teléfono debe contener solo números, +, - y espacios')
        return v

    @validator('estado')
    def validate_estado(cls, v):
        if v is None:
            return v  # Permitir None ya que el campo no existe en la base de datos
        allowed_states = ['pendiente', 'en_proceso', 'completada', 'cancelada']
        if v not in allowed_states:
            raise ValueError(f'Estado debe ser uno de: {", ".join(allowed_states)}')
        return v

    @validator('fecha_sugerida', pre=True)
    def validate_fecha_sugerida(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, str):
            try:
                # Intentar parsear como fecha (YYYY-MM-DD)
                return datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                try:
                    # Intentar parsear como datetime
                    return datetime.fromisoformat(v.replace('Z', '+00:00'))
                except ValueError:
                    raise ValueError('Formato de fecha inválido. Use YYYY-MM-DD')
        return v

    @validator('hora_sugerida', pre=True)
    def validate_hora_sugerida(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, str):
            try:
                # Intentar parsear como hora (HH:MM)
                return datetime.strptime(v, '%H:%M').time()
            except ValueError:
                raise ValueError('Formato de hora inválido. Use HH:MM')
        return v

class SolicitudCreate(SolicitudBase):
    """Model for creating a new solicitud."""
    pass

class SolicitudUpdate(BaseModel):
    """Model for updating a solicitud."""
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    telefono: Optional[str] = Field(None, min_length=8, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    direccion: Optional[str] = Field(None, min_length=10, max_length=200)
    tipo_servicio: Optional[str] = Field(None, min_length=2, max_length=100)
    comentarios: Optional[str] = Field(None, max_length=500)
    estado: Optional[str] = None
    fecha_sugerida: Optional[Union[datetime, date, str]] = None
    hora_sugerida: Optional[Union[time, str]] = None

    @validator('email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError('Email debe ser válido')
        return v

    @validator('telefono')
    def validate_telefono(cls, v):
        if v and not v.replace('+', '').replace('-', '').replace(' ', '').isdigit():
            raise ValueError('Teléfono debe contener solo números, +, - y espacios')
        return v

    @validator('estado')
    def validate_estado(cls, v):
        if v is None:
            return v  # Permitir None ya que el campo no existe en la base de datos
        allowed_states = ['pendiente', 'en_proceso', 'completada', 'cancelada']
        if v not in allowed_states:
            raise ValueError(f'Estado debe ser uno de: {", ".join(allowed_states)}')
        return v

    @validator('fecha_sugerida', pre=True)
    def validate_fecha_sugerida(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, str):
            try:
                # Intentar parsear como fecha (YYYY-MM-DD)
                return datetime.strptime(v, '%Y-%m-%d').date()
            except ValueError:
                try:
                    # Intentar parsear como datetime
                    return datetime.fromisoformat(v.replace('Z', '+00:00'))
                except ValueError:
                    raise ValueError('Formato de fecha inválido. Use YYYY-MM-DD')
        return v

    @validator('hora_sugerida', pre=True)
    def validate_hora_sugerida(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, str):
            try:
                # Intentar parsear como hora (HH:MM)
                return datetime.strptime(v, '%H:%M').time()
            except ValueError:
                raise ValueError('Formato de hora inválido. Use HH:MM')
        return v

class SolicitudResponse(SolicitudBase):
    """Model for solicitud response."""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SolicitudListResponse(BaseModel):
    """Model for solicitud list response."""
    solicitudes: list[SolicitudResponse]
    total: int

class SolicitudStats(BaseModel):
    """Model for solicitud statistics."""
    total: int
    pendientes: int
    confirmadas: int
    en_progreso: int
    completadas: int
    canceladas: int
    por_tipo_servicio: dict
    por_mes: dict