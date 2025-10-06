#!/bin/bash

echo "========================================"
echo "  INSTALACION LANDING PAGE ENFERMERIA"
echo "========================================"
echo

echo "[1/3] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js encontrado"

echo
echo "[2/3] Instalando dependencias..."
if ! npm install; then
    echo "ERROR: Falló la instalación de dependencias"
    exit 1
fi
echo "✓ Dependencias instaladas correctamente"

echo
echo "[3/3] Iniciando servidor de desarrollo..."
echo
echo "========================================"
echo "  SERVIDOR INICIADO EXITOSAMENTE"
echo "========================================"
echo
echo "Abre tu navegador en: http://localhost:3000"
echo
echo "Presiona Ctrl+C para detener el servidor"
echo

npm run dev

