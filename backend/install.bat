@echo off
echo ========================================
echo  Instalacion Backend - Enfermeria API
echo ========================================
echo.

echo [1/4] Creando entorno virtual...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: No se pudo crear el entorno virtual
    echo Asegurate de tener Python instalado
    pause
    exit /b 1
)

echo [2/4] Activando entorno virtual...
call venv\Scripts\activate.bat

echo [3/4] Instalando dependencias...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo [4/4] Configurando archivo de entorno...
if not exist .env (
    copy env.example .env
    echo.
    echo IMPORTANTE: Edita el archivo .env con tus credenciales de Supabase
    echo - SUPABASE_URL=tu_url_de_supabase
    echo - SUPABASE_SERVICE_KEY=tu_service_key_de_supabase
    echo.
)

echo.
echo ========================================
echo  Instalacion completada exitosamente!
echo ========================================
echo.
echo Para ejecutar el backend:
echo 1. Activa el entorno virtual: venv\Scripts\activate
echo 2. Ejecuta: uvicorn main:app --reload
echo.
echo La API estara disponible en: http://localhost:8000
echo.
pause

