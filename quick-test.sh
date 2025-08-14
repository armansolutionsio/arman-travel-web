#!/bin/bash

echo "🚀 ARMAN TRAVEL - Test Rápido PostgreSQL"
echo "======================================="

echo "🛑 Parando contenedores existentes..."
docker-compose down

echo "🔨 Reconstruyendo imágenes..."  
docker-compose build --no-cache

echo "⬆️  Levantando servicios..."
docker-compose up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 15

echo "🔍 Verificando estado de servicios..."
docker-compose ps

echo "🏥 Probando health check..."
curl -s http://localhost:8000/health | jq .

echo ""
echo "📦 Probando obtener paquetes..."
curl -s http://localhost:8000/packages | jq length

echo ""  
echo "🧪 Ejecutando pruebas completas de la API..."
python test-api.py

echo ""
echo "✅ PRUEBA RÁPIDA COMPLETADA"
echo "🌐 Accede a: http://localhost:8000"
echo "👨‍💼 Admin: http://localhost:8000/admin.html"