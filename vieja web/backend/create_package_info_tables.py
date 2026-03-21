"""
Script para crear las nuevas tablas de información de paquetes y características.
"""
from sqlalchemy import create_engine, text
from database import get_db_url
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_package_info_tables():
    """Crear las tablas para package_info y package_features"""
    try:
        # Conectar a la base de datos
        engine = create_engine(get_db_url())
        
        with engine.connect() as conn:
            # Crear tabla package_info
            logger.info("Creando tabla package_info...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS package_info (
                    id SERIAL PRIMARY KEY,
                    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
                    icon VARCHAR(100) NOT NULL,
                    label VARCHAR(255) NOT NULL,
                    value VARCHAR(255) NOT NULL,
                    order_index INTEGER DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))
            
            # Crear tabla package_features
            logger.info("Creando tabla package_features...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS package_features (
                    id SERIAL PRIMARY KEY,
                    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
                    text VARCHAR(255) NOT NULL,
                    order_index INTEGER DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """))
            
            # Crear índices para mejor rendimiento
            logger.info("Creando índices...")
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_package_info_package_id ON package_info(package_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_package_info_order ON package_info(package_id, order_index);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_package_features_package_id ON package_features(package_id);"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_package_features_order ON package_features(package_id, order_index);"))
            
            # Commit cambios
            conn.commit()
            
            logger.info("✅ Tablas creadas exitosamente!")
            
    except Exception as e:
        logger.error(f"❌ Error creando tablas: {str(e)}")
        raise e

def migrate_existing_data():
    """Migrar datos existentes del JSON features a la nueva tabla"""
    try:
        engine = create_engine(get_db_url())
        
        with engine.connect() as conn:
            # Obtener paquetes con features existentes
            result = conn.execute(text("SELECT id, features FROM packages WHERE features IS NOT NULL AND features != '[]';"))
            packages = result.fetchall()
            
            logger.info(f"Migrando features de {len(packages)} paquetes...")
            
            for package in packages:
                package_id = package[0]
                features_json = package[1]
                
                if isinstance(features_json, str):
                    import json
                    try:
                        features = json.loads(features_json)
                    except:
                        continue
                else:
                    features = features_json
                
                if isinstance(features, list):
                    for index, feature in enumerate(features):
                        # Insertar feature en nueva tabla
                        conn.execute(text("""
                            INSERT INTO package_features (package_id, text, order_index)
                            VALUES (:package_id, :text, :order_index)
                        """), {
                            "package_id": package_id,
                            "text": str(feature),
                            "order_index": index
                        })
            
            conn.commit()
            logger.info("✅ Migración de features completada!")
            
    except Exception as e:
        logger.error(f"❌ Error en migración: {str(e)}")
        # No hacer raise aquí para no fallar la creación de tablas

if __name__ == "__main__":
    logger.info("🚀 Iniciando creación de tablas...")
    create_package_info_tables()
    migrate_existing_data()
    logger.info("✅ Proceso completado!")