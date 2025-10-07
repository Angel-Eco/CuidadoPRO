#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de subida de imágenes
"""

import os
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def test_upload_endpoint():
    """Prueba el endpoint de subida de imágenes"""
    
    # URL del endpoint
    base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
    upload_url = f"{base_url}/api/upload/profesional-foto"
    
    print(f"Probando endpoint: {upload_url}")
    
    # Crear una imagen de prueba simple (1x1 pixel PNG)
    test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xdd\x8d\xb4\x1c\x00\x00\x00\x00IEND\xaeB`\x82'
    
    # Preparar el archivo para la petición
    files = {
        'file': ('test_image.png', test_image_data, 'image/png')
    }
    
    try:
        # Hacer la petición POST
        response = requests.post(upload_url, files=files, timeout=30)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Subida exitosa!")
            print(f"Response: {result}")
            
            if result.get('success') and result.get('data', {}).get('url'):
                print(f"URL de la imagen: {result['data']['url']}")
                return True
            else:
                print("❌ Respuesta no contiene URL válida")
                return False
        else:
            print(f"❌ Error en la subida: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Error de conexión. ¿Está ejecutándose el servidor?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Timeout en la petición")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_supabase_connection():
    """Prueba la conexión con Supabase"""
    try:
        from supabase import create_client
        
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not url or not key:
            print("❌ Variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY no configuradas")
            return False
        
        print(f"Conectando a Supabase: {url[:20]}...")
        
        supabase = create_client(url, key)
        
        # Intentar listar buckets
        buckets = supabase.storage.list_buckets()
        print(f"✅ Conexión exitosa. Buckets encontrados: {len(buckets)}")
        
        # Verificar si existe el bucket profesionales-foto
        bucket_names = [bucket.name for bucket in buckets]
        if 'profesionales-foto' in bucket_names:
            print("✅ Bucket 'profesionales-foto' encontrado")
            return True
        else:
            print("❌ Bucket 'profesionales-foto' no encontrado")
            print(f"Buckets disponibles: {bucket_names}")
            return False
            
    except Exception as e:
        print(f"❌ Error conectando a Supabase: {e}")
        return False

def main():
    """Función principal"""
    print("🧪 Iniciando pruebas de subida de imágenes...")
    print("=" * 50)
    
    # Verificar variables de entorno
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Variables de entorno faltantes: {missing_vars}")
        print("Asegúrate de tener un archivo .env con las variables necesarias")
        return False
    
    print("✅ Variables de entorno configuradas")
    
    # Probar conexión con Supabase
    print("\n1. Probando conexión con Supabase...")
    if not test_supabase_connection():
        print("❌ No se puede continuar sin conexión a Supabase")
        return False
    
    # Probar endpoint de subida
    print("\n2. Probando endpoint de subida...")
    if test_upload_endpoint():
        print("\n🎉 ¡Todas las pruebas pasaron exitosamente!")
        print("\nLa funcionalidad de subida de imágenes está lista para usar.")
        return True
    else:
        print("\n❌ Las pruebas fallaron. Revisa la configuración.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
