# 🌥️ Configuración de Cloudinary para ARMAN TRAVEL

## ¿Qué es Cloudinary?

Cloudinary es un servicio en la nube para gestión de imágenes que ofrece:
- ✅ **CDN global** para carga rápida
- ✅ **Optimización automática** de imágenes 
- ✅ **Transformaciones en tiempo real** (resize, crop, format)
- ✅ **Almacenamiento seguro** en la nube
- ✅ **Plan gratuito** generoso (25GB + 25K transformaciones/mes)

## 🚀 Configuración Paso a Paso

### 1. Crear cuenta en Cloudinary

1. Ve a [https://cloudinary.com/](https://cloudinary.com/)
2. Haz clic en **"Sign Up"**
3. Completa el registro (es **gratuito**)
4. Verifica tu email

### 2. Obtener credenciales

1. Inicia sesión en tu dashboard de Cloudinary
2. En la página principal verás tus credenciales:
   ```
   Cloud name: tu_cloud_name
   API Key: 123456789012345
   API Secret: abc123def456ghi789jkl
   ```

### 3. Configurar variables de entorno

#### Opción A: Archivo `.env` (Desarrollo local)
```bash
# Copia .env.example a .env y completa:
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key  
CLOUDINARY_API_SECRET=tu_api_secret
```

#### Opción B: Variables del sistema (Producción)
```bash
export CLOUDINARY_CLOUD_NAME=tu_cloud_name
export CLOUDINARY_API_KEY=tu_api_key
export CLOUDINARY_API_SECRET=tu_api_secret
```

#### Opción C: Render.com / Heroku
Agregar en las variables de entorno del servicio:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 🔧 Reinstalar dependencias

Si ya tienes el proyecto corriendo:

```bash
# Parar contenedores
docker-compose down

# Rebuild con nueva dependencia
docker-compose build --no-cache

# Reiniciar
docker-compose up -d
```

## ✅ Verificar funcionamiento

1. Ve al admin (`/admin.html`)
2. Edita un paquete
3. Sube una imagen
4. La URL debería ser algo como: `https://res.cloudinary.com/tu_cloud_name/image/upload/...`

## 🎯 Beneficios implementados

- **📁 Folders organizados**:
  - `arman-travel/gallery/` - Imágenes de galería
  - `arman-travel/covers/` - Imágenes de portada

- **🔧 Optimizaciones automáticas**:
  - Formato automático (WebP en navegadores compatibles)
  - Calidad optimizada según contenido
  - Resolución máxima: 1200x800px
  - Compresión inteligente

- **🛡️ Fallback robusto**:
  - Si Cloudinary no está configurado → guarda localmente
  - Si hay error → guarda localmente
  - Sin interrupciones en el servicio

## 🆓 Plan gratuito

El plan gratuito de Cloudinary incluye:
- **25 GB** de almacenamiento
- **25,000** transformaciones por mes
- **25 GB** de ancho de banda
- **CDN global**

Perfecto para proyectos pequeños y medianos.

## 🔍 Verificar configuración

El sistema automáticamente detecta si Cloudinary está configurado:
- ✅ **Configurado**: Imágenes se suben a Cloudinary
- ❌ **No configurado**: Imágenes se guardan localmente (como antes)

## 🚨 Solución de problemas

### Error: "Cloud name not found"
- Verifica que `CLOUDINARY_CLOUD_NAME` sea correcto
- No incluyas espacios o caracteres especiales

### Error: "Invalid API key"
- Verifica `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`
- Asegúrate de no tener espacios extra

### Las imágenes no se ven
- Verifica que las URLs sean válidas
- Chequea la consola del navegador por errores CORS

## 📞 Soporte

Si tienes problemas:
1. Verifica las variables de entorno
2. Chequea los logs del contenedor: `docker logs arman-travel-api`
3. El sistema tiene fallback automático a almacenamiento local