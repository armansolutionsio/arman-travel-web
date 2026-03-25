import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Rate limit: max 20 deletes per minute
  const { limited } = rateLimit('delete-image', 20, 60_000)
  if (limited) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  const { url } = await request.json()
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return NextResponse.json({ success: true })
  }

  try {
    // Extract public_id from cloudinary URL
    const parts = url.split('/upload/')
    if (parts[1]) {
      const withoutExtension = parts[1].replace(/\.[^/.]+$/, '')
      // Remove version prefix like v1234567890/
      const publicId = withoutExtension.replace(/^v\d+\//, '')

      // Only allow deleting images from our folder
      if (!publicId.startsWith('arman-travel/')) {
        return NextResponse.json({ error: 'No permitido' }, { status: 403 })
      }

      await cloudinary.uploader.destroy(publicId)
    }
  } catch (err) {
    console.log('Cloudinary delete error:', err)
  }

  return NextResponse.json({ success: true })
}
