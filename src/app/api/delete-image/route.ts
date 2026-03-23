import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { url } = await request.json()
  if (!url || !url.includes('cloudinary.com')) {
    return NextResponse.json({ success: true })
  }

  try {
    // Extract public_id from cloudinary URL
    const parts = url.split('/upload/')
    if (parts[1]) {
      const withoutExtension = parts[1].replace(/\.[^/.]+$/, '')
      // Remove version prefix like v1234567890/
      const publicId = withoutExtension.replace(/^v\d+\//, '')
      await cloudinary.uploader.destroy(publicId)
    }
  } catch (err) {
    console.log('Cloudinary delete error:', err)
  }

  return NextResponse.json({ success: true })
}
