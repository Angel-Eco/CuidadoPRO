from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import re

class UserCreate(BaseModel):
    """Model for creating a new user."""
    username: str
    email: str
    password: str
    full_name: str
    role: str = "admin"  # admin, manager, viewer
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Formato de email inválido')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return v
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        allowed_roles = ['admin', 'manager', 'viewer']
        if v not in allowed_roles:
            raise ValueError(f'Rol debe ser uno de: {", ".join(allowed_roles)}')
        return v

class UserLogin(BaseModel):
    """Model for user login."""
    username: str
    password: str

class UserResponse(BaseModel):
    """Model for user response."""
    id: str
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Model for token response."""
    access_token: str
    token_type: str
    user: UserResponse

class PasswordChange(BaseModel):
    """Model for password change."""
    current_password: str
    new_password: str
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 6:
            raise ValueError('La nueva contraseña debe tener al menos 6 caracteres')
        return v


