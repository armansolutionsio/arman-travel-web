import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface ChatRow {
  telefono: string
  nombre: string | null
  ultimoMensaje: string
  ultimaFecha: Date
  ultimoTipo: string
  noLeidos: number
  total: number
}

// GET: list of conversations, one row per telefono, sorted by last message desc.
// Uses a single SQL query with window functions for scalability — no N+1.
export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const rows = await prisma.$queryRaw<ChatRow[]>`
    SELECT
      telefono,
      MAX(nombre) FILTER (WHERE nombre IS NOT NULL) AS nombre,
      (ARRAY_AGG(mensaje ORDER BY fecha DESC))[1]   AS "ultimoMensaje",
      MAX(fecha)                                    AS "ultimaFecha",
      (ARRAY_AGG(tipo ORDER BY fecha DESC))[1]      AS "ultimoTipo",
      COUNT(*) FILTER (WHERE estado = 'nuevo' AND tipo = 'in')::int AS "noLeidos",
      COUNT(*)::int                                 AS total
    FROM whatsapp_messages
    GROUP BY telefono
    ORDER BY MAX(fecha) DESC
    LIMIT 200
  `

  return NextResponse.json(rows)
}
