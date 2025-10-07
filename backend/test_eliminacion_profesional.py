#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad de eliminación de profesionales con fotos
"""

import requests
import json
import sys

# Configuración
API_BASE_URL = "http://localhost:8000/api"
ADMIN_TOKEN = "tu_token_admin_aqui"  # Reemplaza con tu token de admin

def test_delete_functionality():
    """Prueba la funcionalidad de eliminación de profesionales"""
    
    print("🧪 Probando funcionalidad de eliminación de profesionales con fotos")
    print("=" * 60)
    
    # Headers para autenticación
    headers = {
        "Authorization": f"Bearer {ADMIN_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        # 1. Obtener lista de profesionales
        print("1️⃣ Obteniendo lista de profesionales...")
        response = requests.get(f"{API_BASE_URL}/admin/profesionales", headers=headers)
        
        if response.status_code != 200:
            print(f"❌ Error obteniendo profesionales: {response.status_code}")
            print(response.text)
            return
        
        profesionales = response.json()
        print(f"✅ Encontrados {len(profesionales)} profesionales")
        
        # 2. Buscar un profesional con foto
        profesional_con_foto = None
        for prof in profesionales:
            if prof.get("foto_url") and "supabase.co/storage" in prof.get("foto_url", ""):
                profesional_con_foto = prof
                break
        
        if not profesional_con_foto:
            print("⚠️ No se encontró ningún profesional con foto")
            return
        
        print(f"📸 Profesional con foto encontrado: {profesional_con_foto['nombre']}")
        print(f"🔗 URL de foto: {profesional_con_foto['foto_url']}")
        
        # 3. Probar endpoint de test
        print("\n2️⃣ Probando endpoint de test...")
        test_response = requests.post(
            f"{API_BASE_URL}/admin/test-delete-profesional/{profesional_con_foto['id']}",
            headers=headers
        )
        
        if test_response.status_code == 200:
            test_result = test_response.json()
            print("✅ Test endpoint funcionando:")
            print(json.dumps(test_result, indent=2, ensure_ascii=False))
        else:
            print(f"❌ Error en test endpoint: {test_response.status_code}")
            print(test_response.text)
        
        # 4. Preguntar si eliminar realmente
        print(f"\n3️⃣ ¿Deseas eliminar realmente al profesional '{profesional_con_foto['nombre']}'?")
        print("⚠️ Esta acción eliminará tanto el profesional como su foto del storage")
        
        confirmacion = input("Escribe 'ELIMINAR' para confirmar: ")
        
        if confirmacion == "ELIMINAR":
            print("\n🗑️ Eliminando profesional...")
            delete_response = requests.delete(
                f"{API_BASE_URL}/admin/profesionales/{profesional_con_foto['id']}",
                headers=headers
            )
            
            if delete_response.status_code == 200:
                result = delete_response.json()
                print("✅ Profesional eliminado exitosamente:")
                print(json.dumps(result, indent=2, ensure_ascii=False))
            else:
                print(f"❌ Error eliminando profesional: {delete_response.status_code}")
                print(delete_response.text)
        else:
            print("❌ Eliminación cancelada")
    
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor")
        print("Asegúrate de que el backend esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

def show_usage():
    """Muestra cómo usar el script"""
    print("📋 Uso del script de prueba:")
    print("=" * 40)
    print("1. Asegúrate de que el backend esté ejecutándose")
    print("2. Obtén un token de administrador")
    print("3. Edita la variable ADMIN_TOKEN en este script")
    print("4. Ejecuta: python test_eliminacion_profesional.py")
    print("\n🔑 Para obtener un token de admin:")
    print("   - Ve al panel de administración")
    print("   - Abre las herramientas de desarrollador (F12)")
    print("   - Ve a la pestaña Network")
    print("   - Haz login como admin")
    print("   - Busca una petición a /api/auth/login")
    print("   - Copia el token del header Authorization")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        show_usage()
    else:
        if ADMIN_TOKEN == "tu_token_admin_aqui":
            print("⚠️ Debes configurar el token de administrador en el script")
            print("Edita la variable ADMIN_TOKEN en la línea 10")
            show_usage()
        else:
            test_delete_functionality()
