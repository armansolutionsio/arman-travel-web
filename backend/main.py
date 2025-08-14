from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from database import get_db, test_connection, engine
from models import Package, ContactMessage, Base
import json
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuración
app = FastAPI(title="ARMAN TRAVEL API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas si no existen
Base.metadata.create_all(bind=engine)

# Seguridad
SECRET_KEY = os.getenv("SECRET_KEY", "arman-secret-key-super-secure-2024")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Configuración de email
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "info.armansolutions@gmail.com")  
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")  # Se configura en variables de entorno
RECIPIENT_EMAIL = "info.armansolutions@gmail.com"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Modelos Pydantic
class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class AdminLogin(BaseModel):
    username: str
    password: str

class PackageCreate(BaseModel):
    title: str
    description: str
    price: str
    image: str
    category: str
    features: List[str]
    duration: Optional[str] = None
    destination: Optional[str] = None
    ideal_for: Optional[str] = None
    gallery_images: Optional[List[str]] = []
    itinerary: Optional[List[dict]] = []

class PackageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    image: Optional[str] = None
    category: Optional[str] = None
    features: Optional[List[str]] = None
    duration: Optional[str] = None
    destination: Optional[str] = None
    ideal_for: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    itinerary: Optional[List[dict]] = None

# Eventos de inicio y cierre
@app.on_event("startup")
async def startup():
    print("🚀 Iniciando ARMAN TRAVEL API...")
    print(f"🔧 Python working directory: {os.getcwd()}")
    
    # Intentar conexión a la base de datos con reintentos
    max_retries = 5
    for attempt in range(max_retries):
        if test_connection():
            print("✅ Conexión a PostgreSQL exitosa")
            
            # Inicializar base de datos en producción
            try:
                from init_db import init_database
                init_database()
                break
            except Exception as e:
                print(f"⚠️ Error al inicializar base de datos (intento {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    print("🔄 Reintentando en 2 segundos...")
                    import time
                    time.sleep(2)
        else:
            print(f"❌ Error de conexión a PostgreSQL (intento {attempt + 1}/{max_retries})")
            if attempt < max_retries - 1:
                print("🔄 Reintentando conexión en 3 segundos...")
                import time
                time.sleep(3)

@app.on_event("shutdown")
async def shutdown():
    print("🛑 Cerrando ARMAN TRAVEL API...")

# Funciones de utilidad
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

# Función para verificar admin (credenciales hardcodeadas)
def verify_admin_credentials(username: str, password: str):
    admin_users = {
        "admin": "arman123",
        "arman": "travel2024"
    }
    return admin_users.get(username) == password

# Función para enviar emails
async def send_email(subject: str, body: str, sender_name: str = "ARMAN TRAVEL", sender_email: str = ""):
    """
    Envía un email usando Gmail SMTP
    """
    try:
        # Crear mensaje
        message = MIMEMultipart()
        message["From"] = f"{sender_name} <{SMTP_USER}>"
        message["To"] = RECIPIENT_EMAIL
        message["Subject"] = subject
        
        # Agregar cuerpo del mensaje
        message.attach(MIMEText(body, "plain", "utf-8"))
        
        # Solo intentar enviar si hay contraseña configurada
        if SMTP_PASSWORD:
            # Crear conexión SMTP segura
            context = ssl.create_default_context()
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(message)
            
            print(f"✅ Email enviado correctamente a {RECIPIENT_EMAIL}")
        else:
            print(f"⚠️ Email NO enviado - configuración SMTP no disponible")
            print(f"📧 Contenido del email:")
            print(f"Asunto: {subject}")
            print(f"Destinatario: {RECIPIENT_EMAIL}")
            print(f"Mensaje:\n{body}")
            
    except Exception as e:
        print(f"❌ Error al enviar email: {e}")
        # No lanzamos excepción para no romper el flujo principal

# Servir archivos estáticos
frontend_dir = "frontend" if os.path.exists("frontend") else "../frontend"
app.mount("/static", StaticFiles(directory=f"{frontend_dir}/static"), name="static")

# Función helper para servir archivos HTML
def get_html_file(filename: str, fallback_content: str = None):
    try:
        file_path = f"{frontend_dir}/{filename}"
        with open(file_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        default_content = fallback_content or f"<h1>Archivo {filename} no encontrado</h1><p>El archivo no está disponible.</p>"
        return HTMLResponse(content=default_content)

# Endpoints

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return get_html_file("index.html", "<h1>ARMAN TRAVEL</h1><p>Página principal no disponible</p>")

@app.get("/index.html", response_class=HTMLResponse)
async def read_index():
    return get_html_file("index.html", "<h1>ARMAN TRAVEL</h1><p>Página principal no disponible</p>")

@app.get("/admin.html", response_class=HTMLResponse)
async def read_admin():
    return get_html_file("admin.html", "<h1>Panel de Administración</h1><p>Panel no disponible</p>")

@app.get("/package-detail/{package_id}", response_class=HTMLResponse)
async def read_package_detail(package_id: int):
    return get_html_file("package-detail.html", "<h1>Detalle del Paquete</h1><p>Página no disponible</p>")

@app.post("/contact")
async def contact_message(message: ContactMessageCreate, db: Session = Depends(get_db)):
    try:
        # Crear nuevo mensaje de contacto
        db_message = ContactMessage(
            name=message.name,
            email=message.email,
            phone=message.phone,
            message=message.message
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        # Enviar email de notificación
        subject = f"Nueva consulta de {message.name} - ARMAN TRAVEL"
        email_body = f"""
Nueva consulta recibida en ARMAN TRAVEL

Datos del cliente:
• Nombre: {message.name}
• Email: {message.email}
• Teléfono: {message.phone or 'No proporcionado'}

Mensaje:
{message.message}

---
Enviado desde el sitio web de ARMAN TRAVEL
Fecha: {datetime.utcnow().strftime('%d/%m/%Y %H:%M:%S')} UTC
        """
        
        await send_email(subject, email_body.strip(), message.name, message.email)
        
        return {"message": "Mensaje enviado correctamente"}
            
    except Exception as e:
        print(f"Error al procesar mensaje de contacto: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    if not verify_admin_credentials(credentials.username, credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": credentials.username},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/packages")
async def get_packages(db: Session = Depends(get_db)):
    try:
        packages = db.query(Package).all()
        return [package.to_dict() for package in packages]
        
    except Exception as e:
        print(f"Error al obtener paquetes: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener paquetes")

@app.get("/packages/{package_id}")
async def get_package(package_id: int, db: Session = Depends(get_db)):
    try:
        package = db.query(Package).filter(Package.id == package_id).first()
        if not package:
            raise HTTPException(status_code=404, detail="Paquete no encontrado")
        return package.to_dict()
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al obtener paquete: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener paquete")

@app.post("/admin/packages")
async def create_package(package: PackageCreate, username: str = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        # Crear nuevo paquete
        db_package = Package(
            title=package.title,
            description=package.description,
            price=package.price,
            image=package.image,
            category=package.category,
            features=package.features
        )
        db.add(db_package)
        db.commit()
        db.refresh(db_package)
        
        return db_package.to_dict()
            
    except Exception as e:
        print(f"Error al crear paquete: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.put("/admin/packages/{package_id}")
async def update_package(package_id: int, package: PackageUpdate, username: str = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        db_package = db.query(Package).filter(Package.id == package_id).first()
        if not db_package:
            raise HTTPException(status_code=404, detail="Paquete no encontrado")
        
        # Actualizar campos proporcionados
        update_data = package.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_package, field, value)
        
        db.commit()
        db.refresh(db_package)
        
        return db_package.to_dict()
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al actualizar paquete: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.delete("/admin/packages/{package_id}")
async def delete_package(package_id: int, username: str = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        db_package = db.query(Package).filter(Package.id == package_id).first()
        if not db_package:
            raise HTTPException(status_code=404, detail="Paquete no encontrado")
        
        db.delete(db_package)
        db.commit()
        
        return {"message": "Paquete eliminado correctamente"}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al eliminar paquete: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/admin/contact-messages")
async def get_contact_messages(username: str = Depends(verify_token), db: Session = Depends(get_db)):
    try:
        messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
        return [message.to_dict() for message in messages]
            
    except Exception as e:
        print(f"Error al obtener mensajes: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/health")
async def health_check():
    return {"status": "OK", "message": "ARMAN TRAVEL API funcionando correctamente", "database": "PostgreSQL"}

@app.get("/debug")
async def debug_files():
    try:
        # Listar archivos en directorio actual
        current_dir = os.listdir(".")
        
        # Verificar si existe frontend
        frontend_exists = os.path.exists("frontend")
        frontend_files = []
        if frontend_exists:
            frontend_files = os.listdir("frontend")
        
        # Verificar archivos específicos
        index_exists = os.path.exists("frontend/index.html")
        admin_exists = os.path.exists("frontend/admin.html")
        
        # Verificar conexión a la base de datos
        db_connection = test_connection()
        
        return {
            "current_directory": os.getcwd(),
            "current_dir_files": current_dir,
            "frontend_exists": frontend_exists,
            "frontend_files": frontend_files,
            "index_html_exists": index_exists,
            "admin_html_exists": admin_exists,
            "frontend_dir": frontend_dir,
            "database": "PostgreSQL",
            "database_connection": "OK" if db_connection else "ERROR"
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)