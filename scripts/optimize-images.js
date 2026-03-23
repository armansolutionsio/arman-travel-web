// Optimizes all existing Cloudinary images in the database
// Re-uploads them with eager transforms and updates the URLs
const { Client } = require('pg')

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://arman_user:arman_password_2024@localhost:5432/arman_travel'

// Cloudinary config
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddu5kh0ov',
  api_key: process.env.CLOUDINARY_API_KEY || '425247837769118',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Jgk6GVmke0i0O4IWRBBQVAN-Zl4',
})

async function optimizeImage(url, type) {
  if (!url || !url.includes('cloudinary.com')) return url

  const isCard = type === 'card'
  const width = isCard ? 700 : 1920
  const height = isCard ? 450 : 1080
  const quality = isCard ? 'auto:good' : 'auto:best'

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: 'arman-travel/promos-optimized',
      quality,
      format: 'webp',
      transformation: [{ width, height, crop: 'fill', gravity: 'auto' }],
      eager: [{ width, height, crop: 'fill', quality, format: 'webp' }],
      eager_async: false,
      timeout: 120000,
    })

    const optimizedUrl = result.eager?.[0]?.secure_url || result.secure_url
    console.log(`  ✓ ${type}: ${(result.bytes / 1024).toFixed(0)}KB → optimized`)
    return optimizedUrl
  } catch (err) {
    console.log(`  ✗ Error optimizing ${type}: ${err.message}`)
    return url
  }
}

async function deleteOldImage(url) {
  if (!url || !url.includes('cloudinary.com')) return
  try {
    const parts = url.split('/upload/')
    if (parts[1]) {
      const publicId = parts[1].replace(/\.[^/.]+$/, '').replace(/^v\d+\//, '')
      await cloudinary.uploader.destroy(publicId)
    }
  } catch {}
}

async function main() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false,
  })

  try {
    await client.connect()
    console.log('Connected to PostgreSQL')

    const { rows: promos } = await client.query('SELECT id, title, "cardImage", "backgroundImage" FROM "Promo"')
    console.log(`Found ${promos.length} promos to optimize\n`)

    for (const promo of promos) {
      console.log(`Promo ${promo.id}: ${promo.title}`)

      const oldCard = promo.cardImage
      const oldBg = promo.backgroundImage

      const newCard = await optimizeImage(oldCard, 'card')
      const newBg = await optimizeImage(oldBg, 'background')

      if (newCard !== oldCard || newBg !== oldBg) {
        await client.query(
          'UPDATE "Promo" SET "cardImage" = $1, "backgroundImage" = $2 WHERE id = $3',
          [newCard, newBg, promo.id]
        )
        console.log(`  → URLs updated in DB`)

        // Delete old images
        if (newCard !== oldCard) await deleteOldImage(oldCard)
        if (newBg !== oldBg) await deleteOldImage(oldBg)
        console.log(`  → Old images deleted from Cloudinary`)
      } else {
        console.log(`  → No Cloudinary images to optimize`)
      }
      console.log()
    }

    console.log('Done!')
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

main()
