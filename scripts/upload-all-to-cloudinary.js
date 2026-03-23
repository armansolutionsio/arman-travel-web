// Upload all local images to Cloudinary and output a mapping
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddu5kh0ov',
  api_key: process.env.CLOUDINARY_API_KEY || '425247837769118',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Jgk6GVmke0i0O4IWRBBQVAN-Zl4',
})

const imagesDir = path.join(__dirname, '..', 'public', 'images')

async function uploadFile(filePath, name) {
  const ext = path.extname(filePath).toLowerCase()
  const isLogo = name.includes('logo') || name.includes('qr')

  // Logos and QR keep original format (PNG with transparency)
  // Photos convert to WebP optimized
  const options = {
    folder: 'arman-travel/site',
    public_id: name,
    overwrite: true,
    timeout: 120000,
  }

  if (isLogo) {
    options.format = 'png'
    options.quality = 'auto:best'
  } else {
    options.format = 'webp'
    options.quality = 'auto:good'
    options.transformation = [{ width: 1920, crop: 'limit' }]
  }

  const result = await cloudinary.uploader.upload(filePath, options)
  return result.secure_url
}

async function main() {
  const files = fs.readdirSync(imagesDir).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.')
  )

  console.log(`Found ${files.length} images to upload\n`)

  const mapping = {}

  for (const file of files) {
    const filePath = path.join(imagesDir, file)
    const name = path.parse(file).name

    try {
      const url = await uploadFile(filePath, name)
      const localPath = `/images/${file}`
      mapping[localPath] = url
      console.log(`✓ ${file} → ${url}`)
    } catch (err) {
      console.log(`✗ ${file} → ERROR: ${err.message}`)
    }
  }

  // Write mapping file
  const outputPath = path.join(__dirname, 'image-mapping.json')
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2))
  console.log(`\nMapping saved to ${outputPath}`)
  console.log('\nNow run: node scripts/replace-image-urls.js')
}

main()
