# ARMAN TRAVEL - Agencia de Viajes

Sitio web completo para ARMAN TRAVEL (ARMAN SOLUTIONS) con backend en FastAPI y frontend en HTML/CSS/JavaScript.

## 🚀 Deployment en Render.com

### Paso 1: Preparar el repositorio

1. Sube tu código a GitHub (asegúrate de que el `.env` esté en `.gitignore`)
2. El archivo `render.yaml` ya está configurado

### Paso 2: Crear servicios en Render

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Render detectará automáticamente el `render.yaml`

### Paso 3: Configurar variables de entorno

En Render, configura estas variables de entorno:

#### Base de datos (se configura automáticamente)
- `DATABASE_URL` - Se genera automáticamente con PostgreSQL

#### Email SMTP (opcional pero recomendado)
- `SMTP_USER=info.armansolutions@gmail.com`
- `SMTP_PASSWORD=tu_app_password_de_gmail`

#### Seguridad
- `SECRET_KEY` - Se genera automáticamente

### Paso 4: Deploy

1. Render creará automáticamente:
   - Un servicio web (la aplicación)
   - Una base de datos PostgreSQL
2. La aplicación estará disponible en: `https://tu-app.onrender.com`

## 🔧 Configuración de Gmail para emails

Para que funcione el envío de emails:

1. Ve a tu cuenta de Gmail
2. Habilita la autenticación en 2 pasos
3. Genera una "Contraseña de aplicación"
4. Usa esa contraseña en `SMTP_PASSWORD`

## 📁 Estructura del proyecto

```
arman-travel-web/
├── backend/           # API FastAPI
│   ├── main.py       # Aplicación principal
│   ├── models.py     # Modelos de base de datos
│   ├── database.py   # Configuración de BD
│   └── init_db.py    # Inicialización de datos
├── frontend/         # Frontend estático
│   ├── index.html    # Página principal
│   ├── admin.html    # Panel de administración
│   ├── package-detail.html # Detalle de paquetes
│   └── static/       # CSS, JS, imágenes
├── Dockerfile        # Para deployment
├── render.yaml       # Configuración de Render
└── .env.example      # Ejemplo de variables de entorno
```

## 🌟 Características

- ✅ Página principal con paquetes turísticos
- ✅ Sistema de detalle de paquetes con URLs limpias
- ✅ Panel de administración para gestionar paquetes
- ✅ Formularios de contacto con envío de emails
- ✅ Integración con WhatsApp
- ✅ Diseño responsive
- ✅ Base de datos PostgreSQL
- ✅ Autenticación JWT para admin

## 📞 Contacto

- **Email:** info.armansolutions@gmail.com
- **WhatsApp:** +54 11 3255-1565
- **Empresa:** ARMAN SOLUTIONS
