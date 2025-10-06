@echo off
echo ========================================
echo   INSTALACION LANDING PAGE ENFERMERIA
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [2/3] Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo ✓ Dependencias instaladas correctamente

echo.
echo [3/3] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo   SERVIDOR INICIADO EXITOSAMENTE
echo ========================================
echo.
echo Abre tu navegador en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev

