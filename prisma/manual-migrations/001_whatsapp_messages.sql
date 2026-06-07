-- Migración manual aditiva: solo crea la tabla whatsapp_messages + indexes.
-- NO usar `prisma db push` porque la DB tiene tablas legacy (packages, contact_messages,
-- package_features, package_gallery_images, package_hotels, package_info) que NO están
-- en schema.prisma actual y Prisma pediría dropearlas con pérdida de datos.
--
-- Aplicar:
--   psql "$DATABASE_URL" -f prisma/manual-migrations/001_whatsapp_messages.sql
-- O contra el container:
--   docker exec -i arman-travel-db psql -U arman_user -d arman_travel < prisma/manual-migrations/001_whatsapp_messages.sql

CREATE TABLE IF NOT EXISTS "whatsapp_messages" (
  "id"        SERIAL       PRIMARY KEY,
  "wamid"     TEXT         UNIQUE,
  "telefono"  TEXT         NOT NULL,
  "nombre"    TEXT,
  "mensaje"   TEXT         NOT NULL,
  "tipo"      TEXT         NOT NULL DEFAULT 'in',
  "fecha"     TIMESTAMP(3) NOT NULL,
  "estado"    TEXT         NOT NULL DEFAULT 'nuevo',
  "raw"       JSONB        NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "whatsapp_messages_telefono_fecha_idx" ON "whatsapp_messages" ("telefono", "fecha");
CREATE INDEX IF NOT EXISTS "whatsapp_messages_estado_idx"          ON "whatsapp_messages" ("estado");
