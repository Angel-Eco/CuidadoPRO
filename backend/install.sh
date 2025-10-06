#!/bin/bash

echo "========================================"
echo " Instalacion Backend - Enfermeria API"
echo "========================================"
echo

echo "[1/4] Creando entorno virtual..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudo crear el entorno virtual"
    echo "Asegurate de tener Python3 instalado"
    exit 1
fi

echo "[2/4] Activando entorno virtual..."
source venv/bin/activate

echo "[3/4] Instalando dependencias..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: No se pudieron instalar las dependencias"
    exit 1
fi

echo "[4/4] Configurando archivo de entorno..."
if [ ! -f .env ]; then
    cp env.example .env
    echo
    echo "IMPORTANTE: Edita el archivo .env con tus credenciales de Supabase"
    echo "- SUPABASE_URL=tu_url_de_supabase"
    echo "- SUPABASE_SERVICE_KEY=tu_service_key_de_supabase"
    echo
fi

echo
echo "========================================"
echo " Instalacion completada exitosamente!"
echo "========================================"
echo
echo "Para ejecutar el backend:"
echo "1. Activa el entorno virtual: source venv/bin/activate"
echo "2. Ejecuta: uvicorn main:app --reload"
echo
echo "La API estara disponible en: http://localhost:8000"
echo

