// Creates tables if they don't exist - runs at container startup
const { Client } = require('pg')

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.log('No DATABASE_URL, skipping DB init')
    return
  }

  const client = new Client({
    connectionString: url,
    ssl: url.includes('render.com') ? { rejectUnauthorized: false } : false,
  })

  try {
    await client.connect()
    console.log('Connected to PostgreSQL')

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Promo" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "origin" TEXT NOT NULL,
        "cardImage" TEXT NOT NULL DEFAULT '',
        "backgroundImage" TEXT NOT NULL DEFAULT '',
        "active" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "includes" TEXT[] DEFAULT ARRAY['Aéreos confirmados', 'Alojamiento', 'All Inclusive', 'Traslados'],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "PromoPackage" (
        "id" SERIAL PRIMARY KEY,
        "promoId" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "nights" TEXT NOT NULL,
        "hotel" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "price" TEXT NOT NULL,
        "taxes" TEXT NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "PromoPackage_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "Promo"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );

      CREATE INDEX IF NOT EXISTS "PromoPackage_promoId_idx" ON "PromoPackage"("promoId");
    `)

    console.log('Tables ready')
  } catch (err) {
    console.log('DB init error:', err.message)
  } finally {
    await client.end()
  }
}

main()
