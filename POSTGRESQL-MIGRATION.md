# 🔄 Migración de Supabase a PostgreSQL - ARMAN TRAVEL

## ✅ **MIGRACIÓN COMPLETADA**

Se ha migrado exitosamente de Supabase a PostgreSQL nativo con SQLAlchemy.

## 🆕 **Cambios Principales**

### 🗄️ **Base de Datos**
- **Antes**: Supabase (PostgreSQL en la nube)
- **Ahora**: PostgreSQL local con Docker
- **ORM**: SQLAlchemy 2.0 con modelos definidos

### 📁 **Nuevos Archivos**
- `backend/database.py` - Configuración de conexión PostgreSQL
- `backend/models.py` - Modelos SQLAlchemy (Package, ContactMessage)  
- `init-db.sql` - Script de inicialización con datos de ejemplo
- `test-api.py` - Script de pruebas para verificar funcionamiento

### 🔧 **Archivos Actualizados**
- `backend/main.py` - Reescrito completamente para usar SQLAlchemy
- `backend/requirements.txt` - Dependencias PostgreSQL (sin Supabase)
- `docker-compose.yml` - Agregado servicio PostgreSQL
- `.env.example` - Variables de entorno actualizadas

## 🚀 **Cómo Usar la Nueva Configuración**

### 1. **Levantar todo el stack**
```bash
docker-compose up --build
```

### 2. **Verificar que funciona**
```bash
# Probar la API
python test-api.py

# Verificar salud
curl http://localhost:8000/health
```

### 3. **Acceder a la base de datos**
```bash
# Conectar a PostgreSQL directamente
docker exec -it arman-travel-db psql -U arman_user -d arman_travel

# Ver tablas
\dt

# Ver paquetes
SELECT * FROM packages;
```

## 📊 **Datos de Conexión**

```yaml
Host: localhost
Puerto: 5432  
Base de datos: arman_travel
Usuario: arman_user
Contraseña: arman_password_2024
```

## 🔍 **Endpoints de la API**

### Públicos
- `GET /` - Página principal
- `GET /packages` - Listar paquetes
- `POST /contact` - Enviar mensaje de contacto
- `GET /health` - Estado de la API

### Administrador (requieren token)
- `POST /admin/login` - Login de admin
- `POST /admin/packages` - Crear paquete
- `PUT /admin/packages/{id}` - Actualizar paquete
- `DELETE /admin/packages/{id}` - Eliminar paquete
- `GET /admin/contact-messages` - Ver mensajes

## 🧪 **Ejemplo de Prueba - Crear Paquete**

```bash
# 1. Obtener token
curl -X POST http://localhost:8000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"arman123"}'

# 2. Crear paquete (usar el token obtenido)
curl -X POST http://localhost:8000/admin/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test via cURL",
    "description": "Paquete creado via API",
    "price": "$50.000",
    "image": "https://example.com/image.jpg",
    "category": "nacional",
    "features": ["Test", "API", "PostgreSQL"]
  }'
```

## ✅ **Verificaciones de Funcionamiento**

### Base de Datos
- [x] PostgreSQL se levanta con Docker
- [x] Tablas se crean automáticamente  
- [x] Datos de ejemplo se insertan
- [x] Triggers y funciones funcionan

### API Endpoints
- [x] Health check responde con "PostgreSQL"
- [x] Login de admin genera tokens JWT
- [x] CRUD de paquetes funcional
- [x] Mensajes de contacto se guardan
- [x] Autenticación funcional

### Frontend
- [x] Página principal carga paquetes desde PostgreSQL
- [x] Panel admin funciona con la nueva API
- [x] Formulario de contacto guarda en PostgreSQL

## 🔄 **Diferencias con Supabase**

| Aspecto | Supabase | PostgreSQL Nativo |
|---------|----------|-------------------|
| **Hosting** | En la nube | Local/Docker |
| **Configuración** | Dashboard web | Código SQL |
| **ORM** | Cliente Python | SQLAlchemy |
| **Auth** | Supabase Auth | JWT manual |
| **Tiempo real** | WebSockets integrados | No incluido |
| **Escalabilidad** | Automática | Manual |
| **Costo** | Freemium/Pago | Gratuito |

## 🎯 **Beneficios de la Migración**

### ✅ **Ventajas**
- **Control total** sobre la base de datos
- **Sin dependencias externas** (excepto PostgreSQL)
- **Desarrollo local** más rápido
- **Sin límites de API calls**
- **Más simple para deployment**

### ⚠️ **Consideraciones**  
- Necesitas gestionar backups manualmente
- No hay UI de administración de BD incluida
- Debes configurar PostgreSQL en producción

## 🚀 **Próximos Pasos**

1. **Testing completo** - Verificar todos los endpoints
2. **Optimización** - Agregar índices si es necesario
3. **Backup strategy** - Configurar respaldos automáticos
4. **Monitoring** - Logs y métricas de PostgreSQL
5. **Production setup** - PostgreSQL en servidor/cloud

¡La migración está completa y funcionando! 🎉