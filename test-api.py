#!/usr/bin/env python3
"""
Script para probar la API de ARMAN TRAVEL con PostgreSQL
"""
import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

def test_health():
    """Probar endpoint de salud"""
    print("🔍 Probando endpoint de salud...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check exitoso: {data}")
            print(f"   Database: {data.get('database', 'Unknown')}")
            return True
        else:
            print(f"❌ Health check falló: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión en health check: {e}")
        print("   ¿Está el servidor corriendo en http://localhost:8000?")
        return False
    except Exception as e:
        print(f"❌ Error en health check: {e}")
        return False

def get_admin_token():
    """Obtener token de administrador"""
    print("🔐 Obteniendo token de administrador...")
    try:
        credentials = {
            "username": "admin",
            "password": "arman123"
        }
        response = requests.post(f"{API_BASE_URL}/admin/login", json=credentials)
        if response.status_code == 200:
            data = response.json()
            token = data["access_token"]
            print("✅ Token obtenido exitosamente")
            return token
        else:
            print(f"❌ Error al obtener token: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error al obtener token: {e}")
        return None

def test_get_packages():
    """Probar obtener paquetes"""
    print("📦 Probando obtener paquetes...")
    try:
        response = requests.get(f"{API_BASE_URL}/packages")
        if response.status_code == 200:
            packages = response.json()
            print(f"✅ Se obtuvieron {len(packages)} paquetes")
            for pkg in packages:
                print(f"   - {pkg['title']} ({pkg['category']})")
            return packages
        else:
            print(f"❌ Error al obtener paquetes: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error al obtener paquetes: {e}")
        return None

def test_create_package(token):
    """Probar crear un nuevo paquete"""
    print("➕ Probando crear nuevo paquete...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        new_package = {
            "title": "Test Package - API",
            "description": "Este es un paquete de prueba creado via API para verificar que PostgreSQL funciona correctamente.",
            "price": "$99.999",
            "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "category": "nacional",
            "features": ["Creado via API", "PostgreSQL funcional", "Test exitoso", "SQLAlchemy working"]
        }
        
        response = requests.post(f"{API_BASE_URL}/admin/packages", json=new_package, headers=headers)
        if response.status_code == 200:
            package_data = response.json()
            print(f"✅ Paquete creado exitosamente: ID {package_data['id']}")
            print(f"   Título: {package_data['title']}")
            print(f"   Categoría: {package_data['category']}")
            print(f"   Features: {package_data['features']}")
            return package_data
        else:
            print(f"❌ Error al crear paquete: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error al crear paquete: {e}")
        return None

def test_update_package(token, package_id):
    """Probar actualizar un paquete"""
    print(f"✏️ Probando actualizar paquete ID {package_id}...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        update_data = {
            "price": "$88.888",
            "features": ["Actualizado via API", "PostgreSQL funcional", "Update test exitoso"]
        }
        
        response = requests.put(f"{API_BASE_URL}/admin/packages/{package_id}", json=update_data, headers=headers)
        if response.status_code == 200:
            package_data = response.json()
            print(f"✅ Paquete actualizado exitosamente")
            print(f"   Nuevo precio: {package_data['price']}")
            print(f"   Nuevas features: {package_data['features']}")
            return True
        else:
            print(f"❌ Error al actualizar paquete: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error al actualizar paquete: {e}")
        return False

def test_contact_message():
    """Probar envío de mensaje de contacto"""
    print("💬 Probando envío de mensaje de contacto...")
    try:
        message_data = {
            "name": "Test API",
            "email": "test-api@example.com",
            "phone": "+54 11 1234-5678",
            "message": "Este es un mensaje de prueba enviado via API para verificar que PostgreSQL funciona correctamente."
        }
        
        response = requests.post(f"{API_BASE_URL}/contact", json=message_data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Mensaje de contacto enviado: {result['message']}")
            return True
        else:
            print(f"❌ Error al enviar mensaje: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error al enviar mensaje: {e}")
        return False

def test_get_contact_messages(token):
    """Probar obtener mensajes de contacto"""
    print("📧 Probando obtener mensajes de contacto...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{API_BASE_URL}/admin/contact-messages", headers=headers)
        if response.status_code == 200:
            messages = response.json()
            print(f"✅ Se obtuvieron {len(messages)} mensajes")
            for msg in messages[-3:]:  # Mostrar últimos 3 mensajes
                print(f"   - {msg['name']}: {msg['message'][:50]}...")
            return True
        else:
            print(f"❌ Error al obtener mensajes: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error al obtener mensajes: {e}")
        return False

def main():
    """Ejecutar todas las pruebas"""
    print("🚀 INICIANDO PRUEBAS DE API - ARMAN TRAVEL con PostgreSQL")
    print("=" * 60)
    
    # Esperar un poco para que los servicios se inicialicen
    print("⏳ Esperando que los servicios estén listos...")
    time.sleep(3)
    
    # Test 1: Health check
    if not test_health():
        print("❌ Falla en health check. Abortando pruebas.")
        print("💡 Sugerencias:")
        print("   - Verifica que docker-compose esté corriendo")
        print("   - Ejecuta: docker-compose ps")
        print("   - Revisa logs: docker-compose logs api")
        return
    
    print()
    
    # Test 2: Obtener token
    token = get_admin_token()
    if not token:
        print("❌ No se pudo obtener token. Abortando pruebas.")
        return
    
    print()
    
    # Test 3: Obtener paquetes iniciales
    initial_packages = test_get_packages()
    print()
    
    # Test 4: Crear nuevo paquete
    new_package = test_create_package(token)
    if new_package:
        print()
        
        # Test 5: Actualizar el paquete creado
        test_update_package(token, new_package['id'])
        print()
    
    # Test 6: Obtener paquetes después de crear uno nuevo
    print("📦 Verificando paquetes después de crear uno nuevo...")
    final_packages = test_get_packages()
    print()
    
    # Test 7: Enviar mensaje de contacto
    test_contact_message()
    print()
    
    # Test 8: Obtener mensajes de contacto
    test_get_contact_messages(token)
    print()
    
    print("=" * 60)
    print("🎉 PRUEBAS COMPLETADAS")
    
    if initial_packages is not None and final_packages is not None:
        if len(final_packages) > len(initial_packages):
            print("✅ PostgreSQL está funcionando correctamente!")
            print(f"✅ Se creó exitosamente un nuevo paquete via API")
            print(f"✅ Paquetes iniciales: {len(initial_packages)}")
            print(f"✅ Paquetes finales: {len(final_packages)}")
        else:
            print("⚠️  No se detectó aumento en la cantidad de paquetes")

if __name__ == "__main__":
    main()