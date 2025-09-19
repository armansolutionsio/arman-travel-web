"""
Script para actualizar hoteles existentes con valores por defecto para los nuevos campos
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def fix_existing_hotels():
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        # Actualizar hoteles existentes que tienen valores NULL en los nuevos campos
        try:
            # Actualizar destination
            result = conn.execute(text("""
                UPDATE package_hotels
                SET destination = 'Destino principal'
                WHERE destination IS NULL
            """))
            print(f"Actualizado destination en {result.rowcount} hoteles")

            # Actualizar days
            result = conn.execute(text("""
                UPDATE package_hotels
                SET days = 1
                WHERE days IS NULL
            """))
            print(f"Actualizado days en {result.rowcount} hoteles")

            # Actualizar order_in_destination
            result = conn.execute(text("""
                UPDATE package_hotels
                SET order_in_destination = 0
                WHERE order_in_destination IS NULL
            """))
            print(f"Actualizado order_in_destination en {result.rowcount} hoteles")

            conn.commit()
            print("Hoteles existentes actualizados exitosamente")

        except Exception as e:
            print(f"Error actualizando hoteles: {e}")
            conn.rollback()

if __name__ == "__main__":
    fix_existing_hotels()