#!/usr/bin/env python3
"""
Script para verificar la conexión con Supabase
"""

import os
from dotenv import load_dotenv

def test_connection():
    print("🔍 Verificando configuración de Supabase...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check if .env file exists
    if not os.path.exists('.env'):
        print("❌ ERROR: Archivo .env no encontrado")
        print("📝 Crea el archivo .env con:")
        print("   SUPABASE_URL=tu_url_aqui")
        print("   SUPABASE_SERVICE_KEY=tu_service_key_aqui")
        return False
    
    print("✅ Archivo .env encontrado")
    
    # Get environment variables
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    # Check URL
    print(f"\n🌐 SUPABASE_URL:")
    if not url:
        print("   ❌ No configurado")
        return False
    elif not url.startswith('https://'):
        print(f"   ❌ Formato incorrecto: {url}")
        print("   💡 Debe empezar con 'https://'")
        return False
    elif '.supabase.co' not in url:
        print(f"   ❌ URL inválida: {url}")
        print("   💡 Debe contener '.supabase.co'")
        return False
    else:
        print(f"   ✅ Formato correcto: {url[:30]}...")
    
    # Check Service Key
    print(f"\n🔑 SUPABASE_SERVICE_KEY:")
    if not key:
        print("   ❌ No configurado")
        return False
    elif len(key) < 50:
        print(f"   ❌ Muy corto: {len(key)} caracteres")
        print("   💡 Debe ser la service key completa")
        return False
    else:
        print(f"   ✅ Configurado: {len(key)} caracteres")
    
    # Test connection
    print(f"\n🔌 Probando conexión...")
    try:
        from database.connection import get_supabase_client
        client = get_supabase_client()
        print("   ✅ Conexión exitosa!")
        
        # Test table access
        print(f"\n📊 Probando acceso a tabla 'solicitudes'...")
        result = client.table("solicitudes").select("*").limit(1).execute()
        print("   ✅ Tabla 'solicitudes' accesible!")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Error de conexión: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_connection()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 ¡Configuración correcta! El backend debería funcionar.")
    else:
        print("❌ Hay problemas con la configuración. Revisa los errores arriba.")
        print("\n📋 Pasos para solucionar:")
        print("1. Ve a tu proyecto en Supabase")
        print("2. Copia la URL del proyecto (Settings > API)")
        print("3. Copia la service key (Settings > API > service_role key)")
        print("4. Actualiza el archivo .env con estos valores")






