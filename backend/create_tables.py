"""
Script para crear las tablas de la base de datos
"""
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import os

# Configurar la base de datos
DATABASE_URL = "sqlite:///arman_travel.db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Definir los modelos (copiados de models.py)
class Package(Base):
    __tablename__ = "packages"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(String(100), nullable=False)
    image = Column(String(500), nullable=False)
    category = Column(String(50), nullable=False)
    features = Column(JSON, nullable=False, default=list)
    duration = Column(String(100), nullable=True)
    destination = Column(String(255), nullable=True)
    ideal_for = Column(String(255), nullable=True)
    gallery_images = Column(JSON, nullable=False, default=list)
    itinerary = Column(JSON, nullable=False, default=list)
    promoted = Column(Boolean, default=False, nullable=False)
    carousel_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PackageHotel(Base):
    __tablename__ = "package_hotels"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey('packages.id'), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=False)
    price = Column(String(100), nullable=False)
    amenities = Column(JSON, nullable=False, default=list)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PackageGalleryImage(Base):
    __tablename__ = "package_gallery_images"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey('packages.id'), nullable=False)
    image_url = Column(String(500), nullable=False)
    image_filename = Column(String(255), nullable=True)
    caption = Column(String(255), nullable=True)
    order_index = Column(Integer, default=0)
    is_cover = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Crear todas las tablas
try:
    Base.metadata.create_all(bind=engine)
    print("✓ Todas las tablas creadas exitosamente!")
    
    # Verificar que la tabla package_hotels tiene la columna amenities
    import sqlite3
    conn = sqlite3.connect("arman_travel.db")
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(package_hotels)")
    columns = cursor.fetchall()
    print("\nColumnas en package_hotels:")
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")
    
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")