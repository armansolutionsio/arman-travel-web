import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// GET: single promo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { limited } = rateLimit(`promo-get:${ip}`, 60, 60_000)
  if (limited) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const promo = await prisma.promo.findUnique({
    where: { id: numId },
    include: { packages: { orderBy: { order: 'asc' } } },
  })
  if (!promo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(promo)
}

// PUT: update promo
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const data = await request.json()
  const { packages, createdAt, updatedAt, id: _dataId, ...rest } = data

  const cleanPackages = (packages || []).map((pkg: Record<string, unknown>, i: number) => ({
    date: String(pkg.date || ''),
    nights: String(pkg.nights || ''),
    hotel: String(pkg.hotel || ''),
    location: String(pkg.location || pkg.destination || pkg.city || ''),
    price: String(pkg.price || ''),
    taxes: String(pkg.taxes || ''),
    order: typeof pkg.order === 'number' ? pkg.order : i,
  }))

  await prisma.promoPackage.deleteMany({ where: { promoId: numId } })

  const promo = await prisma.promo.update({
    where: { id: numId },
    data: {
      title: String(rest.title || ''),
      origin: String(rest.origin || ''),
      cardImage: String(rest.cardImage || ''),
      backgroundImage: String(rest.backgroundImage || ''),
      active: rest.active !== false,
      order: typeof rest.order === 'number' ? rest.order : 0,
      includes: Array.isArray(rest.includes) ? rest.includes : undefined,
      packages: { create: cleanPackages },
    },
    include: { packages: true },
  })

  return NextResponse.json(promo)
}

// DELETE: delete promo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const numId = parseInt(id)
  if (isNaN(numId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const promo = await prisma.promo.findUnique({ where: { id: numId } })

  // Delete cloudinary images
  if (promo) {
    const urls = [promo.cardImage, promo.backgroundImage].filter(
      (u) => u && u.includes('cloudinary.com')
    )
    for (const url of urls) {
      try {
        const { default: cloudinary } = await import('@/lib/cloudinary')
        const parts = url.split('/upload/')
        if (parts[1]) {
          const publicId = parts[1].replace(/\.[^/.]+$/, '').replace(/^v\d+\//, '')
          await cloudinary.uploader.destroy(publicId)
        }
      } catch {}
    }
  }

  await prisma.promo.delete({ where: { id: numId } })
  return NextResponse.json({ success: true })
}
