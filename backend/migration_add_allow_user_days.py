"""
Migración para agregar campo allow_user_days a la tabla package_hotels
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def run_migration():
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        try:
            # Agregar columna allow_user_days
            conn.execute(text("""
                ALTER TABLE package_hotels
                ADD COLUMN allow_user_days BOOLEAN DEFAULT FALSE NOT NULL
            """))
            print("Agregada columna allow_user_days")
        except Exception as e:
            print(f"allow_user_days ya existe o error: {e}")

        conn.commit()
        print("Migracion completada exitosamente")

if __name__ == "__main__":
    run_migration()