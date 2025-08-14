#!/bin/bash

echo "🔍 ARMAN TRAVEL - Debug de archivos"
echo "=================================="

echo "📂 Contenido del directorio raíz:"
ls -la

echo ""
echo "📂 Contenido de backend/:"
ls -la backend/

echo ""
echo "📂 Contenido de frontend/:"
ls -la frontend/

echo ""
echo "🐳 Verificando contenedor..."
docker-compose ps

echo ""
echo "📋 Logs del API:"
docker-compose logs api --tail=10

echo ""
echo "🔧 Ejecutando comando dentro del contenedor..."
docker-compose exec api ls -la /app/

echo ""
echo "🔧 Verificando frontend en el contenedor..."
docker-compose exec api ls -la /app/frontend/

echo ""
echo "✅ Debug completado!"