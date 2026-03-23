// Seed script: inserts the Caribbean promo into the database
const { Client } = require('pg')

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://arman_user:arman_password_2024@localhost:5432/arman_travel'

async function main() {
  const client = new Client({ connectionString: DATABASE_URL })

  try {
    await client.connect()
    console.log('Connected to PostgreSQL')

    // Check if the promo already exists
    const existing = await client.query(
      'SELECT "id" FROM "Promo" WHERE "title" = $1',
      ['Caribe']
    )

    if (existing.rows.length > 0) {
      console.log('Promo "Caribe" already exists (id=%d), skipping.', existing.rows[0].id)
      return
    }

    // Insert promo
    const promoResult = await client.query(
      `INSERT INTO "Promo" ("title", "origin", "cardImage", "backgroundImage", "active", "order", "includes")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING "id"`,
      [
        'Caribe',
        'Buenos Aires',
        '/images/miami.jpg',
        '/images/destinos.png',
        true,
        0,
        ['Aéreos confirmados', 'Alojamiento', 'All Inclusive', 'Traslados'],
      ]
    )

    const promoId = promoResult.rows[0].id
    console.log('Inserted Promo "Caribe" with id=%d', promoId)

    // Insert packages
    const packages = [
      {
        date: '18 Abril',
        nights: '9 Noches',
        hotel: 'Iberostar Waves Dominicana',
        location: 'Punta Cana',
        price: 'USD 2.275',
        taxes: '+ Imp. Aéreos 228 | IVA463 USD 590',
        order: 0,
      },
      {
        date: '2 Mayo',
        nights: '10 Noches',
        hotel: 'Bahia Principe Grand Aquamarine',
        location: 'Punta Cana',
        price: 'USD 2.055',
        taxes: '+ Imp. Aéreos 228 | IVA463 USD 499',
        order: 1,
      },
      {
        date: '10 Mayo',
        nights: '7 Noches',
        hotel: 'Ocean Coral',
        location: 'Montego Bay',
        price: 'USD 2.139',
        taxes: '+ Imp. Aéreos 232 | IVA463 USD 496',
        order: 2,
      },
    ]

    for (const pkg of packages) {
      await client.query(
        `INSERT INTO "PromoPackage" ("promoId", "date", "nights", "hotel", "location", "price", "taxes", "order")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [promoId, pkg.date, pkg.nights, pkg.hotel, pkg.location, pkg.price, pkg.taxes, pkg.order]
      )
      console.log('  Inserted package: %s - %s (%s)', pkg.date, pkg.hotel, pkg.location)
    }

    console.log('Seed complete: 1 promo + %d packages', packages.length)
  } catch (err) {
    console.error('Seed error:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
