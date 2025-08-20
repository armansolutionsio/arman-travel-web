"""
Migracion para agregar campos promoted y carousel_order a la tabla packages
"""
import os
import sys
from sqlalchemy import create_engine, text

# URL de conexión a PostgreSQL - Compatible con Render
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback para desarrollo local
    DATABASE_URL = "postgresql://arman_user:arman_password_2024@localhost:5432/arman_travel"
    print("Usando base de datos de desarrollo local")

# Render usa postgres:// pero SQLAlchemy 1.4+ requiere postgresql://
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    print("URL de base de datos convertida para SQLAlchemy")

def migrate_add_carousel_fields():
    """Agregar campos promoted y carousel_order a la tabla packages"""
    try:
        # Crear conexión a la base de datos
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as connection:
            # Verificar si las columnas ya existen
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'packages' 
                AND column_name IN ('promoted', 'carousel_order')
            """))
            
            existing_columns = [row[0] for row in result.fetchall()]
            
            # Agregar columna promoted si no existe
            if 'promoted' not in existing_columns:
                print("Agregando columna 'promoted'...")
                connection.execute(text("""
                    ALTER TABLE packages 
                    ADD COLUMN promoted BOOLEAN NOT NULL DEFAULT FALSE
                """))
                print("OK - Columna 'promoted' agregada exitosamente")
            else:
                print("AVISO - Columna 'promoted' ya existe")
            
            # Agregar columna carousel_order si no existe
            if 'carousel_order' not in existing_columns:
                print("Agregando columna 'carousel_order'...")
                connection.execute(text("""
                    ALTER TABLE packages 
                    ADD COLUMN carousel_order INTEGER NOT NULL DEFAULT 0
                """))
                print("OK - Columna 'carousel_order' agregada exitosamente")
            else:
                print("AVISO - Columna 'carousel_order' ya existe")
            
            # Confirmar cambios
            connection.commit()
            print("EXITO - Migracion completada exitosamente")
            
    except Exception as e:
        print(f"ERROR en la migracion: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("INICIO - Iniciando migracion para campos del carrusel...")
    success = migrate_add_carousel_fields()
    
    if success:
        print("EXITO - Migracion completada. Puedes reiniciar la aplicacion.")
        sys.exit(0)
    else:
        print("ERROR - Migracion fallo.")
        sys.exit(1)