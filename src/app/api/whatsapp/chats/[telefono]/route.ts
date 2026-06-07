import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// E.164 sin "+" — Meta entrega wa_id en este formato. Aceptamos 8-15 dígitos.
const TELEFONO_REGEX = /^\d{8,15}$/

export async function GET(_request: Request, ctx: { params: Promise<{ telefono: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { telefono } = await ctx.params
  if (!TELEFONO_REGEX.test(telefono)) {
    return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 })
  }

  const messages = await prisma.whatsappMessage.findMany({
    where: { telefono },
    orderBy: { fecha: 'asc' },
    select: {
      id: true,
      telefono: true,
      nombre: true,
      mensaje: true,
      tipo: true,
      fecha: true,
      estado: true,
    },
    take: 500,
  })

  return NextResponse.json(messages)
}

// PATCH: marca todos los entrantes "nuevo" de este teléfono como "leido"
export async function PATCH(_request: Request, ctx: { params: Promise<{ telefono: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { telefono } = await ctx.params
  if (!TELEFONO_REGEX.test(telefono)) {
    return NextResponse.json({ error: 'Teléfono inválido' }, { status: 400 })
  }

  const result = await prisma.whatsappMessage.updateMany({
    where: { telefono, tipo: 'in', estado: 'nuevo' },
    data: { estado: 'leido' },
  })

  return NextResponse.json({ updated: result.count })
}
