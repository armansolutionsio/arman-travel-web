-- Inicialización de la base de datos PostgreSQL para ARMAN TRAVEL
-- Este archivo se ejecuta automáticamente al crear el contenedor PostgreSQL

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla para paquetes de viajes
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(100) NOT NULL,
    image VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('nacional', 'internacional', 'aventura', 'relax')),
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar automáticamente updated_at en packages
DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at 
    BEFORE UPDATE ON packages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos paquetes de ejemplo
INSERT INTO packages (title, description, price, image, category, features) VALUES
(
    'Buenos Aires Clásico',
    'Descubre la capital argentina con este paquete completo de 3 días. Incluye visitas a los barrios más emblemáticos, espectáculos de tango y la mejor gastronomía local.',
    '$45.000',
    'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'nacional',
    '["3 días / 2 noches", "Desayuno incluido", "City tour", "Tango show", "Traslados incluidos"]'
),
(
    'Bariloche Aventura',
    'Vive la aventura patagónica con deportes extremos y paisajes únicos. Incluye actividades de rafting, trekking y visitas a los cerros más famosos de la región.',
    '$75.000',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'aventura',
    '["5 días / 4 noches", "Pensión completa", "Rafting", "Cerro Catedral", "Trekking", "Guía especializado"]'
),
(
    'Miami Beach',
    'Disfruta de las mejores playas de Florida en este paquete internacional completo. Incluye vuelos, hotel y las mejores actividades de la ciudad.',
    'USD 899',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'internacional',
    '["7 días / 6 noches", "Hotel 4 estrellas", "Vuelos incluidos", "Traslados", "Desayuno buffet", "City tour opcional"]'
),
(
    'Mendoza Relax',
    'Relájate entre viñedos y montañas en la capital del vino argentino. Incluye degustaciones, spa y la mejor gastronomía regional.',
    '$55.000',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'relax',
    '["4 días / 3 noches", "Spa incluido", "Tour de bodegas", "Cena gourmet", "Degustación de vinos", "Masajes incluidos"]'
) ON CONFLICT DO NOTHING;