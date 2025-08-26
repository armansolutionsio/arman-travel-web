"""
Configuración de la base de datos PostgreSQL con SQLAlchemy
"""
import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión a PostgreSQL - Compatible con Render
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback para desarrollo local
    DATABASE_URL = "postgresql://arman_user:arman_password_2024@localhost:5432/arman_travel"
    print("[WARNING] Usando base de datos de desarrollo local")

# Render usa postgres:// pero SQLAlchemy 1.4+ requiere postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    print("[INFO] URL de base de datos convertida para SQLAlchemy")

print(f"[INFO] Conectando a: {DATABASE_URL[:50]}...")

# Motor de SQLAlchemy
engine = create_engine(DATABASE_URL, echo=False)

# Sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Metadata para las tablas
metadata = MetaData()

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Función para probar la conexión a la base de datos
def test_connection():
    try:
        with engine.connect() as connection:
            from sqlalchemy import text
            connection.execute(text("SELECT 1"))
        return True
    except Exception as e:
        print(f"Error de conexión a la base de datos: {e}")
        return False