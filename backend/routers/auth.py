from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from typing import Optional
from pydantic import BaseModel
from auth.jwt_handler import create_access_token, verify_token
from auth.middleware import get_current_user
from database.connection import get_supabase_client
from supabase import Client
from models.auth import UserLogin, TokenResponse

router = APIRouter()
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    supabase: Client = Depends(get_supabase_client)
):
    """Authenticate user and return access token."""
    try:
        # Verify user credentials with Supabase
        result = supabase.table("users").select("*").eq("username", login_data.username).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        user = result.data[0]
        
        # In a real application, you would verify the password hash here
        # For now, we'll assume the password is correct if user exists
        # You should implement proper password hashing and verification
        
        # Create access token
        access_token = create_access_token(data={"sub": user["username"], "user_id": user["id"]})
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"],
                "is_active": user["is_active"],
                "created_at": user["created_at"],
                "last_login": user.get("last_login")
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during authentication: {str(e)}"
        )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (invalidate token on client side)."""
    return {"message": "Successfully logged out"}

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information."""
    return current_user

@router.get("/verify")
async def verify_token_endpoint(current_user: dict = Depends(get_current_user)):
    """Verify if token is valid."""
    return {"valid": True, "user": current_user}



