#!/usr/bin/env python3
"""
Script para probar el endpoint de solicitudes
"""

import requests
import json

def test_endpoint():
    url = "http://localhost:8000/api/solicitud"
    
    # Datos de prueba
    test_data = {
        "nombre": "Test User",
        "telefono": "+56 9 1234 5678",
        "email": "test@example.com",
        "direccion": "Test Address 123",
        "tipo_servicio": "curacion",
        "comentarios": "Test comment"
    }
    
    print("🧪 Probando endpoint de solicitudes...")
    print(f"URL: {url}")
    print(f"Datos: {json.dumps(test_data, indent=2)}")
    print("-" * 50)
    
    try:
        response = requests.post(url, json=test_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        try:
            result = response.json()
            print(f"Response JSON: {json.dumps(result, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            print("✅ ¡Endpoint funcionando correctamente!")
        else:
            print("❌ Error en el endpoint")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor")
        print("💡 Asegúrate de que el backend esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_endpoint()






