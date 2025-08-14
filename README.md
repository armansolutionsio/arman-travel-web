# ARMAN TRAVEL - Página Web de Agencia de Viajes

Página web completa para la agencia de viajes ARMAN TRAVEL de ARMAN SOLUTIONS, desarrollada con Python (FastAPI) en el backend y HTML/CSS/JavaScript en el frontend.

## 🚀 Características Principales

- **Frontend Moderno**: Diseño responsivo inspirado en myjourney.com.ar con los colores violeta de la marca ARMAN
- **Backend Robusto**: API REST desarrollada con FastAPI
- **Panel de Administración**: Sistema completo para gestionar paquetes y ver mensajes de contacto
- **Base de Datos**: Integración con Supabase para almacenamiento persistente
- **Autenticación**: Sistema de login seguro para administradores
- **Responsive**: Adaptable a todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome para iconos
- Google Fonts (Poppins)
- Diseño responsive con CSS Grid y Flexbox

### Backend
- Python 3.11+
- FastAPI
- PostgreSQL nativo con SQLAlchemy
- JWT para autenticación
- Bcrypt para hash de passwords
- Uvicorn como servidor ASGI

## 📁 Estructura del Proyecto

```
arman-travel-web/
├── backend/
│   ├── main.py              # API principal con FastAPI
│   ├── database.py          # Configuración PostgreSQL
│   ├── models.py            # Modelos SQLAlchemy
│   ├── requirements.txt     # Dependencias de Python
│   ├── Dockerfile          # Imagen Docker del backend
│   └── .env                # Variables de entorno
├── frontend/
│   ├── index.html          # Página principal
│   ├── admin.html          # Panel de administración
│   └── static/
│       ├── css/
│       │   ├── style.css   # Estilos principales
│       │   └── admin.css   # Estilos del panel admin
│       ├── js/
│       │   ├── script.js   # JavaScript principal
│       │   └── admin.js    # JavaScript del panel admin
│       └── images/
│           └── logo_arman.PNG
├── docker-compose.yml       # Configuración principal Docker
├── docker-compose.override.yml  # Configuración para desarrollo
├── docker-compose.prod.yml  # Configuración para producción  
├── nginx.conf              # Configuración de Nginx
├── .env.example            # Ejemplo de variables de entorno
├── .dockerignore          # Archivos ignorados por Docker
├── init-db.sql           # Script de inicialización PostgreSQL
├── test-api.py            # Script de pruebas de la API
├── README.md
└── logo_arman.PNG
```

## 🔧 Instalación y Configuración

### 🐳 **Opción 1: Con Docker (Recomendado)**

#### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd arman-travel-web
```

#### 2. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Las variables de entorno están preconfiguradas para Docker
# Solo cambia SECRET_KEY en producción
```

#### 3. La base de datos se configura automáticamente
PostgreSQL se levanta automáticamente con Docker Compose y se inicializa con datos de ejemplo.

#### 4. Levantar el Proyecto
```bash
# Levantar todos los servicios
docker-compose up

# O en modo detached (segundo plano)
docker-compose up -d

# Para ver los logs
docker-compose logs -f
```

#### 5. Acceder a la Aplicación
- **Frontend**: `http://localhost:8000` (vía FastAPI)
- **Nginx** (opcional): `http://localhost` (puerto 80)
- **Admin Panel**: `http://localhost:8000/admin.html`
- **PostgreSQL**: `localhost:5432` (usuario: `arman_user`, db: `arman_travel`)

#### 6. Probar la API
```bash
# Probar que PostgreSQL funciona correctamente
python test-api.py
```

### 💻 **Opción 2: Instalación Manual**

#### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd arman-travel-web
```

#### 2. Configurar el Backend
```bash
cd backend
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

#### 3. Configurar PostgreSQL
1. Instala PostgreSQL localmente
2. Crea la base de datos: `createdb arman_travel`
3. Ejecuta el script de inicialización: `psql arman_travel < init-db.sql`
4. Actualiza DATABASE_URL en el archivo `.env`

#### 4. Ejecutar el Proyecto
```bash
# Desde la carpeta backend
python main.py
```

El backend estará disponible en `http://localhost:8000`

## 👨‍💼 Panel de Administración

### Acceso
- URL: `http://localhost:8000/admin.html`
- Credenciales por defecto:
  - Usuario: `admin` / Contraseña: `arman123`
  - Usuario: `arman` / Contraseña: `travel2024`

### Funcionalidades del Admin
- **Dashboard**: Estadísticas y actividad reciente
- **Gestión de Paquetes**: Crear, editar y eliminar paquetes de viajes
- **Mensajes de Contacto**: Ver mensajes enviados por los clientes
- **Filtros**: Organizar paquetes por categoría (nacional, internacional, aventura, relax)

## 🎨 Personalización de Colores

El sitio web utiliza los colores oficiales de ARMAN basados en el logo:
- **Violeta Principal**: `#7b4397`
- **Violeta Oscuro**: `#5a2d70`
- **Violeta Claro**: `#9b59b6`

Los colores están definidos como variables CSS en `frontend/static/css/style.css` y pueden modificarse fácilmente.

## 🚀 Comandos Docker Útiles

### Desarrollo
```bash
# Levantar en modo desarrollo (con hot reload)
docker-compose up

# Reconstruir las imágenes
docker-compose build

# Ver logs de un servicio específico
docker-compose logs api
docker-compose logs nginx

# Ejecutar comandos dentro del contenedor
docker-compose exec api bash
```

### Producción
```bash
# Levantar en modo producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### Gestión
```bash
# Ver estado de los contenedores
docker-compose ps

# Reiniciar un servicio
docker-compose restart api

# Eliminar contenedores y redes
docker-compose down --remove-orphans
```

## 🚀 Deployment

### Opciones de Deployment

1. **Docker Swarm**: Para clusters de producción
2. **Kubernetes**: Para orquestación avanzada
3. **Railway/Render**: Plataformas con soporte Docker nativo
4. **DigitalOcean App Platform**: Deploy directo con docker-compose
5. **AWS ECS/Fargate**: Contenedores serverless
6. **Google Cloud Run**: Contenedores escalables

### Variables de Entorno para Producción
```env
SUPABASE_URL=tu_url_de_produccion
SUPABASE_KEY=tu_clave_de_produccion
SECRET_KEY=clave_secreta_muy_fuerte_y_larga_para_produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
```

### Deploy con Docker en Servidor
```bash
# En el servidor de producción
git clone <repo-url>
cd arman-travel-web

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con valores de producción

# Levantar en producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔒 Seguridad

- Autenticación JWT para rutas de administrador
- CORS configurado para el frontend
- Row Level Security (RLS) en Supabase
- Validación de datos con Pydantic

---

**¡Gracias por elegir ARMAN TRAVEL para crear experiencias de viaje únicas!** ✈️🌍