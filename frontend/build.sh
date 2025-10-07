#!/bin/bash

# Script de build para Render
set -e

echo "🚀 Iniciando build para Render..."

# Verificar Node.js y npm
echo "📋 Verificando versiones..."
node --version
npm --version

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci --verbose

# Verificar que las variables de entorno estén configuradas
echo "🔧 Verificando variables de entorno..."
echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-'NO CONFIGURADA'}"
echo "NEXT_PUBLIC_WHATSAPP_NUMBER: ${NEXT_PUBLIC_WHATSAPP_NUMBER:-'NO CONFIGURADA'}"
echo "NEXT_PUBLIC_APP_NAME: ${NEXT_PUBLIC_APP_NAME:-'NO CONFIGURADA'}"

# Lint check
echo "🔍 Ejecutando lint..."
npm run lint || echo "⚠️ Lint falló, continuando con el build..."

# Build de la aplicación
echo "🏗️  Construyendo aplicación..."
npm run build --verbose

echo "✅ Build completado exitosamente!"
