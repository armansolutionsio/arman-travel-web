"""
Script para inicializar la base de datos con datos de ejemplo
"""
from database import engine, SessionLocal
from models import Base, Package
from sqlalchemy import text, inspect
import json

def run_migrations(db):
    """Ejecutar migraciones pendientes para columnas nuevas"""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns('packages')]

    # Migración: agregar price_tag si no existe
    if 'price_tag' not in columns:
        db.execute(text("ALTER TABLE packages ADD COLUMN price_tag VARCHAR(50) NOT NULL DEFAULT 'DESDE'"))
        db.commit()
        print("✅ Migración: columna price_tag agregada")

def init_database():
    """Inicializa la base de datos con las tablas y datos de ejemplo"""

    # Crear todas las tablas
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente")
    
    # Crear sesión
    db = SessionLocal()

    try:
        # Ejecutar migraciones pendientes
        run_migrations(db)

        # Verificar si ya hay paquetes
        existing_packages = db.query(Package).count()
        if existing_packages > 0:
            print("ℹ️ La base de datos ya contiene paquetes")
            return
            
        # Datos de ejemplo
        sample_packages = [
            {
                "title": "Buenos Aires Clásico",
                "description": "Descubre la capital argentina con este paquete completo de 3 días. Incluye visitas a los barrios más emblemáticos, espectáculos de tango y la mejor gastronomía local.",
                "price": "$45.000",
                "image": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "category": "nacional",
                "features": ["3 días / 2 noches", "Desayuno incluido", "City tour", "Tango show", "Traslados incluidos"],
                "duration": "3 días / 2 noches",
                "destination": "Buenos Aires",
                "ideal_for": "Parejas y familias",
                "gallery_images": [
                    "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                ],
                "itinerary": [
                    {"title": "Día 1 - Llegada", "description": "Recepción en el destino y traslado al hotel. Tiempo libre para conocer los alrededores."},
                    {"title": "Día 2 - City Tour", "description": "Tour completo por los principales atractivos del destino con guía especializado."},
                    {"title": "Día 3 - Experiencias", "description": "Actividades especiales y degustación de gastronomía local."}
                ]
            },
            {
                "title": "Bariloche Aventura",
                "description": "Vive la aventura patagónica con deportes extremos y paisajes únicos. Incluye actividades de rafting, trekking y visitas a los cerros más famosos de la región.",
                "price": "$75.000",
                "image": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "category": "aventura",
                "features": ["5 días / 4 noches", "Pensión completa", "Rafting", "Cerro Catedral", "Trekking", "Guía especializado"],
                "duration": "5 días / 4 noches",
                "destination": "Bariloche",
                "ideal_for": "Aventureros y amantes del deporte",
                "gallery_images": [],
                "itinerary": []
            },
            {
                "title": "Miami Beach",
                "description": "Disfruta de las mejores playas de Florida en este paquete internacional completo. Incluye vuelos, hotel y las mejores actividades de la ciudad.",
                "price": "USD 899",
                "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "category": "internacional",
                "features": ["7 días / 6 noches", "Hotel 4 estrellas", "Vuelos incluidos", "Traslados", "Desayuno buffet", "City tour opcional"],
                "duration": "7 días / 6 noches",
                "destination": "Miami, USA",
                "ideal_for": "Familias y parejas",
                "gallery_images": [],
                "itinerary": []
            }
        ]
        
        # Insertar paquetes de ejemplo
        for pkg_data in sample_packages:
            package = Package(**pkg_data)
            db.add(package)
        
        db.commit()
        print(f"✅ Se insertaron {len(sample_packages)} paquetes de ejemplo")
        
    except Exception as e:
        print(f"❌ Error al inicializar la base de datos: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()