"""
Migración para agregar soporte de múltiples destinos y días a hoteles
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def run_migration():
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        # Agregar nuevas columnas a package_hotels
        try:
            conn.execute(text("""
                ALTER TABLE package_hotels
                ADD COLUMN destination VARCHAR(255) DEFAULT 'Destino principal'
            """))
            print("✓ Agregada columna destination")
        except Exception as e:
            print(f"destination ya existe o error: {e}")

        try:
            conn.execute(text("""
                ALTER TABLE package_hotels
                ADD COLUMN days INTEGER DEFAULT 1
            """))
            print("✓ Agregada columna days")
        except Exception as e:
            print(f"days ya existe o error: {e}")

        try:
            conn.execute(text("""
                ALTER TABLE package_hotels
                ADD COLUMN order_in_destination INTEGER DEFAULT 0
            """))
            print("✓ Agregada columna order_in_destination")
        except Exception as e:
            print(f"order_in_destination ya existe o error: {e}")

        # Crear tabla para selecciones de hoteles por usuario (opcional para futuro) - PostgreSQL syntax
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS package_hotel_selections (
                    id SERIAL PRIMARY KEY,
                    package_id INTEGER NOT NULL,
                    destination VARCHAR(255) NOT NULL,
                    selected_hotels JSONB NOT NULL,
                    total_price VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (package_id) REFERENCES packages (id)
                )
            """))
            print("Creada tabla package_hotel_selections")
        except Exception as e:
            print(f"Error creando package_hotel_selections: {e}")

        conn.commit()
        print("Migracion completada exitosamente")

if __name__ == "__main__":
    run_migration()