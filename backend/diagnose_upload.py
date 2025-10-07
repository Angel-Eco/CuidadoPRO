#!/usr/bin/env python3
"""
Script de diagnóstico rápido para problemas de subida de archivos
"""

import os
import sys
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def check_environment():
    """Verifica las variables de entorno"""
    print("🔍 Verificando variables de entorno...")
    
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    missing_vars = []
    
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
            print(f"❌ {var}: NO CONFIGURADA")
        else:
            # Mostrar solo los primeros caracteres por seguridad
            if var == "SUPABASE_URL":
                print(f"✅ {var}: {value[:20]}...")
            else:
                print(f"✅ {var}: {'*' * 20}...")
    
    if missing_vars:
        print(f"\n❌ Variables faltantes: {missing_vars}")
        return False
    
    print("✅ Todas las variables de entorno están configuradas")
    return True

def test_supabase_connection():
    """Prueba la conexión con Supabase"""
    print("\n🔗 Probando conexión con Supabase...")
    
    try:
        from supabase import create_client
        
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        
        print(f"📡 Conectando a: {url[:20]}...")
        
        supabase = create_client(url, key)
        print("✅ Cliente de Supabase creado exitosamente")
        
        # Probar listar buckets
        print("📦 Listando buckets...")
        buckets = supabase.storage.list_buckets()
        print(f"✅ Se encontraron {len(buckets)} buckets")
        
        bucket_names = [bucket.name for bucket in buckets]
        print(f"📦 Buckets: {bucket_names}")
        
        # Verificar bucket específico
        if 'profesionales-foto' in bucket_names:
            print("✅ Bucket 'profesionales-foto' encontrado")
            return True
        else:
            print("❌ Bucket 'profesionales-foto' NO encontrado")
            print("💡 Necesitas crear el bucket en Supabase Storage")
            return False
            
    except Exception as e:
        print(f"❌ Error conectando a Supabase: {e}")
        return False

def test_file_upload():
    """Prueba la subida de un archivo pequeño"""
    print("\n📤 Probando subida de archivo...")
    
    try:
        from supabase import create_client
        
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        supabase = create_client(url, key)
        
        # Crear un archivo de prueba pequeño
        test_content = b"test content"
        test_filename = "test_file.txt"
        
        print(f"📁 Subiendo archivo de prueba: {test_filename}")
        
        result = supabase.storage.from_("profesionales-foto").upload(
            test_filename,
            test_content,
            file_options={
                "content-type": "text/plain"
            }
        )
        
        print(f"📤 Resultado: {result}")
        
        # Limpiar archivo de prueba
        supabase.storage.from_("profesionales-foto").remove([test_filename])
        print("🧹 Archivo de prueba eliminado")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en subida de prueba: {e}")
        print(f"❌ Tipo de error: {type(e)}")
        return False

def main():
    """Función principal de diagnóstico"""
    print("🔧 DIAGNÓSTICO DE SUBIDA DE ARCHIVOS")
    print("=" * 50)
    
    # Verificar variables de entorno
    if not check_environment():
        print("\n❌ No se puede continuar sin las variables de entorno")
        return False
    
    # Probar conexión con Supabase
    if not test_supabase_connection():
        print("\n❌ No se puede continuar sin conexión a Supabase")
        return False
    
    # Probar subida de archivo
    if test_file_upload():
        print("\n🎉 ¡Diagnóstico completado exitosamente!")
        print("✅ La configuración está correcta")
        return True
    else:
        print("\n❌ Hay problemas con la subida de archivos")
        print("💡 Revisa los logs anteriores para más detalles")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
