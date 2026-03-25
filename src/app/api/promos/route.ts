import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// GET: public - fetch all active promos with packages
export async function GET(request: Request) {
  // Rate limit: max 60 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { limited } = rateLimit(`promos-get:${ip}`, 60, 60_000)
  if (limited) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  const promos = await prisma.promo.findMany({
    where: { active: true },
    include: { packages: { orderBy: { order: 'asc' } } },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(promos)
}

// POST: admin - create new promo
export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await request.json()
  const { packages, createdAt, updatedAt, id, ...rest } = data

  const cleanPackages = (packages || []).map((pkg: Record<string, unknown>, i: number) => ({
    date: String(pkg.date || ''),
    nights: String(pkg.nights || ''),
    hotel: String(pkg.hotel || ''),
    location: String(pkg.location || pkg.destination || pkg.city || ''),
    price: String(pkg.price || ''),
    taxes: String(pkg.taxes || ''),
    order: typeof pkg.order === 'number' ? pkg.order : i,
  }))

  const promo = await prisma.promo.create({
    data: {
      title: String(rest.title || ''),
      origin: String(rest.origin || 'Buenos Aires'),
      cardImage: String(rest.cardImage || ''),
      backgroundImage: String(rest.backgroundImage || ''),
      active: rest.active !== false,
      order: typeof rest.order === 'number' ? rest.order : 0,
      includes: Array.isArray(rest.includes) ? rest.includes : ['Aéreos confirmados', 'Alojamiento', 'All Inclusive', 'Traslados'],
      packages: { create: cleanPackages },
    },
    include: { packages: true },
  })

  return NextResponse.json(promo, { status: 201 })
}
