#!/bin/bash

# Script de build para Render
set -e

echo "🚀 Iniciando build para Render..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Verificar que las variables de entorno estén configuradas
echo "🔧 Verificando variables de entorno..."
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_API_URL no está configurada"
fi

# Build de la aplicación
echo "🏗️  Construyendo aplicación..."
npm run build

echo "✅ Build completado exitosamente!"
