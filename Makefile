# Makefile para ARMAN TRAVEL
# Comandos útiles para desarrollo y producción

.PHONY: help build up down logs clean restart dev prod setup

# Ayuda
help:
	@echo "🚀 ARMAN TRAVEL - Comandos disponibles:"
	@echo ""
	@echo "  make setup     - Configuración inicial del proyecto"
	@echo "  make dev       - Levantar en modo desarrollo"
	@echo "  make prod      - Levantar en modo producción"
	@echo "  make build     - Construir las imágenes Docker"
	@echo "  make up        - Levantar todos los servicios"
	@echo "  make down      - Parar todos los servicios"
	@echo "  make logs      - Ver logs de todos los servicios"
	@echo "  make restart   - Reiniciar todos los servicios"
	@echo "  make clean     - Limpiar contenedores e imágenes"
	@echo ""

# Configuración inicial
setup:
	@echo "🔧 Configurando proyecto ARMAN TRAVEL..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✅ Archivo .env creado"; fi
	@echo "⚠️  IMPORTANTE: Configura tus credenciales de Supabase en el archivo .env"
	@echo "📚 Lee el archivo README.md para más instrucciones"

# Desarrollo
dev:
	@echo "🚀 Levantando ARMAN TRAVEL en modo desarrollo..."
	docker-compose up --build

# Producción
prod:
	@echo "🚀 Levantando ARMAN TRAVEL en modo producción..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Construir imágenes
build:
	@echo "🔨 Construyendo imágenes Docker..."
	docker-compose build

# Levantar servicios
up:
	@echo "⬆️  Levantando servicios..."
	docker-compose up -d

# Parar servicios
down:
	@echo "⬇️  Parando servicios..."
	docker-compose down

# Ver logs
logs:
	@echo "📋 Mostrando logs..."
	docker-compose logs -f

# Reiniciar servicios
restart:
	@echo "🔄 Reiniciando servicios..."
	docker-compose restart

# Limpiar
clean:
	@echo "🧹 Limpiando contenedores e imágenes..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	@echo "✅ Limpieza completada"

# Estado de los servicios
status:
	@echo "📊 Estado de los servicios:"
	docker-compose ps

# Ejecutar shell en el backend
shell:
	@echo "🐚 Accediendo al contenedor del backend..."
	docker-compose exec api bash

# Instalar dependencias (desarrollo local)
install:
	@echo "📦 Instalando dependencias..."
	cd backend && pip install -r requirements.txt

# Actualizar dependencias
update:
	@echo "🔄 Actualizando dependencias..."
	cd backend && pip install --upgrade -r requirements.txt

# Backup de la base de datos (requiere configuración)
backup:
	@echo "💾 Creando backup... (configurar según tu setup de Supabase)"
	@echo "⚠️  Implementa tu estrategia de backup para Supabase"

# Test (placeholder para futuros tests)
test:
	@echo "🧪 Ejecutando tests..."
	@echo "⚠️  No hay tests configurados aún"

# Default target
.DEFAULT_GOAL := help