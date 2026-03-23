// Replaces all local image paths in source files with Cloudinary URLs
const fs = require('fs')
const path = require('path')

const mapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'image-mapping.json'), 'utf-8')
)

const srcDir = path.join(__dirname, '..', 'src')

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false

  for (const [local, cdn] of Object.entries(mapping)) {
    if (content.includes(local)) {
      content = content.split(local).join(cdn)
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content)
    console.log(`✓ Updated: ${filePath}`)
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      replaceInFile(fullPath)
    }
  }
}

console.log(`Replacing ${Object.keys(mapping).length} image URLs...\n`)
walkDir(srcDir)
console.log('\nDone! All local image paths replaced with Cloudinary URLs.')
