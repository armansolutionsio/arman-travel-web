#!/bin/bash

echo "🚀 ARMAN TRAVEL - Inicio rápido"
echo "================================"

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales de Supabase"
    echo ""
fi

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker-compose down 2>/dev/null || true

# Reconstruir y levantar
echo "🔨 Reconstruyendo imágenes..."
docker-compose build --no-cache

echo "⬆️  Levantando servicios..."
docker-compose up

echo ""
echo "✅ ARMAN TRAVEL iniciado!"
echo "🌐 Frontend: http://localhost:8000"
echo "👨‍💼 Admin: http://localhost:8000/admin.html"
echo ""
echo "Credenciales de admin:"
echo "- Usuario: admin / Contraseña: arman123"
echo "- Usuario: arman / Contraseña: travel2024"