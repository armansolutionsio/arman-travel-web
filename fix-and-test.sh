#!/bin/bash

echo "🔧 ARMAN TRAVEL - Fix de Dependencias y Test"
echo "============================================"

echo "🛑 Parando y limpiando contenedores..."
docker-compose down -v
docker system prune -f

echo "🗑️ Eliminando imágenes existentes..."
docker image rm arman-travel-web-api 2>/dev/null || true

echo "🔨 Reconstruyendo imagen desde cero..."
docker-compose build --no-cache --pull

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso!"
    
    echo "⬆️ Levantando servicios..."
    docker-compose up -d
    
    echo "⏳ Esperando que PostgreSQL esté listo..."
    sleep 10
    
    echo "🔍 Verificando estado de servicios..."
    docker-compose ps
    
    echo "📋 Logs del API:"
    docker-compose logs api --tail=10
    
    echo "🏥 Probando endpoints..."
    echo "Health check:"
    curl -s http://localhost:8000/health | jq . || curl -s http://localhost:8000/health
    
    echo ""
    echo "Debug info:"
    curl -s http://localhost:8000/debug | jq . || curl -s http://localhost:8000/debug
    
    echo ""
    echo "🧪 Si todo está OK, ejecuta: python test-api.py"
    echo "🌐 Frontend: http://localhost:8000"
    echo "👨‍💼 Admin: http://localhost:8000/admin.html"
    
else
    echo "❌ Build falló. Revisa los logs arriba."
    echo "📋 Mostrando logs de build..."
    docker-compose logs api
fi