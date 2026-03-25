import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Rate limit: max 20 uploads per minute
  const { limited } = rateLimit('upload', 20, 60_000)
  if (limited) {
    return NextResponse.json({ error: 'Demasiados uploads. Esperá un momento.' }, { status: 429 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'card' or 'background'
    if (!file) return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 })

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Usá JPG, PNG, WebP o GIF.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El archivo es muy pesado. Máximo 10MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Card images: 700px wide (shown small in cards)
    // Background images: 1920px wide (shown full screen in popup)
    const isCard = type === 'card'

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'arman-travel/promos',
      quality: isCard ? 'auto:good' : 'auto:best',
      format: 'webp',
      transformation: [
        {
          width: isCard ? 700 : 1920,
          height: isCard ? 450 : 1080,
          crop: 'fill',
          gravity: 'auto',
        },
      ],
      // Pre-generate optimized versions so they load instantly
      eager: isCard
        ? [{ width: 700, height: 450, crop: 'fill', quality: 'auto:good', format: 'webp' }]
        : [{ width: 1920, height: 1080, crop: 'fill', quality: 'auto:best', format: 'webp' }],
      eager_async: false, // Wait for eager to finish before returning
      timeout: 120000,
    })

    // Return the eager URL (pre-generated, loads instantly) or fallback to main
    const optimizedUrl = result.eager?.[0]?.secure_url || result.secure_url

    return NextResponse.json({ url: optimizedUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: 'Error al subir imagen. Intentá con una imagen más liviana.' },
      { status: 500 },
    )
  }
}
