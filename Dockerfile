# Dockerfile para producción en Render.com
FROM python:3.11-slim

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=8000

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements y instalar dependencias Python
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copiar todo el código
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Cambiar al directorio del backend
WORKDIR /app/backend

# Exponer puerto (Render lo asigna dinámicamente)
EXPOSE $PORT

# Comando de inicio flexible para Render
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}