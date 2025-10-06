from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ProfesionalBase(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100, description="Nombre completo del profesional")
    especialidad: str = Field(..., min_length=2, max_length=100, description="Especialidad del profesional")
    experiencia: int = Field(..., ge=0, le=50, description="Años de experiencia")
    descripcion: str = Field(..., min_length=10, max_length=500, description="Descripción del profesional")
    telefono: Optional[str] = Field(None, max_length=20, description="Teléfono de contacto")
    email: Optional[str] = Field(None, max_length=100, description="Email de contacto")
    activo: bool = Field(True, description="Si el profesional está activo")
    orden: int = Field(0, ge=0, description="Orden de aparición en la página")

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

class ProfesionalCreate(ProfesionalBase):
    imagen_url: Optional[str] = Field(None, description="URL de la imagen del profesional")

class ProfesionalUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=2, max_length=100)
    especialidad: Optional[str] = Field(None, min_length=2, max_length=100)
    experiencia: Optional[int] = Field(None, ge=0, le=50)
    descripcion: Optional[str] = Field(None, min_length=10, max_length=500)
    telefono: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    activo: Optional[bool] = None
    orden: Optional[int] = Field(None, ge=0)
    imagen_url: Optional[str] = None

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

class ProfesionalResponse(ProfesionalBase):
    id: str
    imagen_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProfesionalListResponse(BaseModel):
    profesionales: list[ProfesionalResponse]
    total: int




