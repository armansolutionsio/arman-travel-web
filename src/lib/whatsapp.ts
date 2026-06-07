import crypto from 'crypto'

export interface ParsedIncomingMessage {
  wamid: string
  telefono: string
  nombre: string | null
  mensaje: string
  fecha: Date
}

interface MetaContact {
  wa_id?: string
  profile?: { name?: string }
}

interface MetaMessage {
  id?: string
  from?: string
  timestamp?: string
  type?: string
  text?: { body?: string }
  image?: { caption?: string }
  video?: { caption?: string }
  document?: { caption?: string; filename?: string }
  audio?: { id?: string }
  voice?: { id?: string }
  location?: { latitude?: number; longitude?: number; name?: string; address?: string }
  button?: { text?: string }
  interactive?: {
    button_reply?: { title?: string }
    list_reply?: { title?: string }
  }
  reaction?: { emoji?: string }
}

interface MetaChange {
  value?: {
    contacts?: MetaContact[]
    messages?: MetaMessage[]
  }
  field?: string
}

interface MetaEntry {
  changes?: MetaChange[]
}

export interface MetaWebhookPayload {
  object?: string
  entry?: MetaEntry[]
}

export function verifyMetaSignature(rawBody: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false
  const provided = signatureHeader.slice('sha256='.length)
  const expected = crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')
  const a = Buffer.from(provided, 'hex')
  const b = Buffer.from(expected, 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

function summarizeMessage(msg: MetaMessage): string {
  switch (msg.type) {
    case 'text':
      return msg.text?.body || ''
    case 'image':
      return msg.image?.caption ? `[Imagen] ${msg.image.caption}` : '[Imagen]'
    case 'video':
      return msg.video?.caption ? `[Video] ${msg.video.caption}` : '[Video]'
    case 'audio':
    case 'voice':
      return '[Audio]'
    case 'document': {
      const name = msg.document?.filename ? ` (${msg.document.filename})` : ''
      const caption = msg.document?.caption ? `: ${msg.document.caption}` : ''
      return `[Documento]${name}${caption}`
    }
    case 'location': {
      const loc = msg.location
      const place = loc?.name || loc?.address || ''
      return place ? `[Ubicación] ${place}` : '[Ubicación]'
    }
    case 'button':
      return msg.button?.text || '[Botón]'
    case 'interactive':
      return msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '[Interactivo]'
    case 'reaction':
      return msg.reaction?.emoji ? `[Reacción] ${msg.reaction.emoji}` : '[Reacción]'
    default:
      return `[${msg.type || 'desconocido'}]`
  }
}

export function extractMessages(payload: MetaWebhookPayload): ParsedIncomingMessage[] {
  const out: ParsedIncomingMessage[] = []
  const entries = payload.entry || []

  for (const entry of entries) {
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue
      const value = change.value || {}
      const contacts = value.contacts || []
      const nameByWaId = new Map<string, string>()
      for (const c of contacts) {
        if (c.wa_id && c.profile?.name) nameByWaId.set(c.wa_id, c.profile.name)
      }
      for (const msg of value.messages || []) {
        if (!msg.id || !msg.from) continue
        const tsSec = Number(msg.timestamp)
        const fecha = Number.isFinite(tsSec) && tsSec > 0 ? new Date(tsSec * 1000) : new Date()
        out.push({
          wamid: msg.id,
          telefono: msg.from,
          nombre: nameByWaId.get(msg.from) ?? null,
          mensaje: summarizeMessage(msg),
          fecha,
        })
      }
    }
  }
  return out
}
