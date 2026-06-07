import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractMessages, verifyMetaSignature, type MetaWebhookPayload } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// GET: Meta sends this once to verify the webhook URL.
// We must echo back hub.challenge if hub.verify_token matches our env var.
export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  const expected = process.env.WHATSAPP_VERIFY_TOKEN
  if (!expected) {
    console.error('[whatsapp/webhook] WHATSAPP_VERIFY_TOKEN no está configurado')
    return new NextResponse('Server misconfigured', { status: 500 })
  }

  if (mode === 'subscribe' && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200, headers: { 'content-type': 'text/plain' } })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// POST: Meta delivers incoming messages here.
// We MUST respond 200 quickly — Meta retries aggressively on failure or timeout,
// and after enough failures will pause delivery to the subscription.
export async function POST(request: Request) {
  // Read raw body BEFORE parsing JSON — HMAC must be computed over exact bytes.
  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (appSecret) {
    if (!verifyMetaSignature(rawBody, signature, appSecret)) {
      console.warn('[whatsapp/webhook] Firma inválida — request rechazado')
      return new NextResponse('Invalid signature', { status: 401 })
    }
  } else {
    console.warn('[whatsapp/webhook] WHATSAPP_APP_SECRET no configurado — webhook acepta requests sin verificar')
  }

  let payload: MetaWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    // Bad payload but still respond 200 so Meta doesn't retry forever.
    console.error('[whatsapp/webhook] JSON inválido en payload')
    return new NextResponse('OK', { status: 200 })
  }

  // Persist asynchronously so we always 200 quickly even if DB is slow.
  // Errors are logged but not surfaced — Meta would just retry and create duplicates.
  persistMessages(payload).catch((err) => {
    console.error('[whatsapp/webhook] Error al guardar mensajes:', err)
  })

  return new NextResponse('OK', { status: 200 })
}

async function persistMessages(payload: MetaWebhookPayload) {
  const messages = extractMessages(payload)
  if (messages.length === 0) return

  for (const m of messages) {
    try {
      await prisma.whatsappMessage.create({
        data: {
          wamid: m.wamid,
          telefono: m.telefono,
          nombre: m.nombre,
          mensaje: m.mensaje,
          tipo: 'in',
          fecha: m.fecha,
          estado: 'nuevo',
          raw: payload as object,
        },
      })
    } catch (err: unknown) {
      // P2002 = unique constraint violation on wamid → duplicate webhook delivery, safe to ignore.
      const code = (err as { code?: string })?.code
      if (code === 'P2002') continue
      throw err
    }
  }
}
