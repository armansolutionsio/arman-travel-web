// Re-optimizes background images to be smaller (1280px, good quality)
const { Client } = require('pg')
const cloudinary = require('cloudinary').v2

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://arman_user:dwNYglIlqrPrXEWwto4mA98pfHOJxBO7@dpg-d2f2teodl3ps73eepdr0-a.oregon-postgres.render.com/arman_travel'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddu5kh0ov',
  api_key: process.env.CLOUDINARY_API_KEY || '425247837769118',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Jgk6GVmke0i0O4IWRBBQVAN-Zl4',
})

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false,
  })

  await client.connect()
  console.log('Connected')

  const { rows } = await client.query('SELECT id, title, "backgroundImage" FROM "Promo"')

  for (const row of rows) {
    if (!row.backgroundImage || !row.backgroundImage.includes('cloudinary.com')) {
      console.log(`${row.id} ${row.title}: skipped (no cloudinary URL)`)
      continue
    }

    // Strip existing transforms to get the raw image
    const rawUrl = row.backgroundImage.replace(/\/upload\/[^/]*\//, '/upload/')

    try {
      const result = await cloudinary.uploader.upload(rawUrl, {
        folder: 'arman-travel/promos-bg',
        quality: 'auto:good',
        format: 'webp',
        transformation: [{ width: 1280, height: 720, crop: 'fill', gravity: 'auto' }],
        eager: [{ width: 1280, height: 720, crop: 'fill', quality: 'auto:good', format: 'webp' }],
        eager_async: false,
        timeout: 120000,
      })

      const newUrl = result.eager?.[0]?.secure_url || result.secure_url
      await client.query('UPDATE "Promo" SET "backgroundImage" = $1 WHERE id = $2', [newUrl, row.id])
      console.log(`${row.id} ${row.title}: ${(result.bytes / 1024).toFixed(0)}KB → done`)
    } catch (err) {
      console.log(`${row.id} ${row.title}: ERROR ${err.message}`)
    }
  }

  await client.end()
  console.log('\nDone!')
}

main()
