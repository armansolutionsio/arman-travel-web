import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 })

    // Convert to base64 data URI for simpler upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'arman-travel/promos',
      quality: 'auto',
      format: 'webp',
      transformation: [{ width: 1920, crop: 'limit' }],
      timeout: 120000,
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: 'Error al subir imagen. Intentá con una imagen más liviana.' },
      { status: 500 }
    )
  }
}
