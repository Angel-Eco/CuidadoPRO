from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import solicitudes, auth, admin, profesionales, upload

app = FastAPI(
    title="Enfermería a Domicilio API",
    description="API para gestionar solicitudes de servicios de enfermería",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(solicitudes.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin Panel"])
app.include_router(profesionales.router, prefix="/api/profesionales", tags=["Profesionales"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Enfermería a Domicilio API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint for Render."""
    return {"status": "healthy", "service": "enfermeria-api"}

