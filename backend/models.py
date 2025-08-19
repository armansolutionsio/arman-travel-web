"""
Modelos SQLAlchemy para ARMAN TRAVEL
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import json

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
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        """Convertir el modelo a diccionario para JSON"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "image": self.image,
            "category": self.category,
            "features": self.features if isinstance(self.features, list) else json.loads(self.features) if self.features else [],
            "duration": self.duration,
            "destination": self.destination,
            "ideal_for": self.ideal_for,
            "gallery_images": self.gallery_images if isinstance(self.gallery_images, list) else json.loads(self.gallery_images) if self.gallery_images else [],
            "itinerary": self.itinerary if isinstance(self.itinerary, list) else json.loads(self.itinerary) if self.itinerary else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class PackageGalleryImage(Base):
    __tablename__ = "package_gallery_images"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(Integer, ForeignKey('packages.id'), nullable=False)
    image_url = Column(String(500), nullable=False)
    image_filename = Column(String(255), nullable=True)  # Para archivos subidos
    caption = Column(String(255), nullable=True)
    order_index = Column(Integer, default=0)
    is_cover = Column(Integer, default=0)  # 1 si es imagen principal
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """Convertir el modelo a diccionario para JSON"""
        return {
            "id": self.id,
            "package_id": self.package_id,
            "image_url": self.image_url,
            "image_filename": self.image_filename,
            "caption": self.caption,
            "order_index": self.order_index,
            "is_cover": self.is_cover,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        """Convertir el modelo a diccionario para JSON"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }