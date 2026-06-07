'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface ChatSummary {
  telefono: string
  nombre: string | null
  ultimoMensaje: string
  ultimaFecha: string
  ultimoTipo: string
  noLeidos: number
  total: number
}

interface ChatMessage {
  id: number
  telefono: string
  nombre: string | null
  mensaje: string
  tipo: string
  fecha: string
  estado: string
}

const POLL_MS = 5000

function formatPhone(telefono: string) {
  // Argentina: 549 11 1234 5678 → +54 9 11 1234-5678. Si no matchea, devolvemos con + adelante.
  if (telefono.startsWith('549') && telefono.length >= 12) {
    const rest = telefono.slice(3)
    const area = rest.slice(0, rest.length - 8)
    const a = rest.slice(-8, -4)
    const b = rest.slice(-4)
    return `+54 9 ${area} ${a}-${b}`
  }
  return `+${telefono}`
}

function formatListTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) {
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}

function formatBubbleTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function dayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Hoy'
  if (d.toDateString() === yesterday.toDateString()) return 'Ayer'
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function LeadsWpp() {
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [loadingChat, setLoadingChat] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMsgIdRef = useRef<number | null>(null)

  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp/chats', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ChatSummary[] = await res.json()
      setChats(data)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando chats')
    } finally {
      setLoadingList(false)
    }
  }, [])

  const fetchMessages = useCallback(async (telefono: string, opts: { silent?: boolean } = {}) => {
    if (!opts.silent) setLoadingChat(true)
    try {
      const res = await fetch(`/api/whatsapp/chats/${telefono}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ChatMessage[] = await res.json()
      setMessages(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando conversación')
    } finally {
      if (!opts.silent) setLoadingChat(false)
    }
  }, [])

  const markAsRead = useCallback(async (telefono: string) => {
    try {
      await fetch(`/api/whatsapp/chats/${telefono}`, { method: 'PATCH' })
    } catch {
      // No bloqueamos UX por esto
    }
  }, [])

  // Carga inicial + polling cada 5s para lista y conversación abierta
  useEffect(() => {
    fetchChats()
    const interval = setInterval(() => {
      fetchChats()
      if (selected) fetchMessages(selected, { silent: true })
    }, POLL_MS)
    return () => clearInterval(interval)
  }, [fetchChats, fetchMessages, selected])

  // Al abrir un chat: cargar mensajes y marcar como leído
  useEffect(() => {
    if (!selected) {
      setMessages([])
      lastMsgIdRef.current = null
      return
    }
    fetchMessages(selected)
    markAsRead(selected).then(() => fetchChats())
  }, [selected, fetchMessages, markAsRead, fetchChats])

  // Auto-scroll al final cuando llega un msg nuevo
  useEffect(() => {
    if (messages.length === 0) return
    const lastId = messages[messages.length - 1].id
    if (lastMsgIdRef.current !== lastId) {
      lastMsgIdRef.current = lastId
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return chats
    return chats.filter((c) =>
      (c.nombre?.toLowerCase().includes(q)) ||
      c.telefono.includes(q) ||
      c.ultimoMensaje.toLowerCase().includes(q),
    )
  }, [chats, search])

  const selectedChat = chats.find((c) => c.telefono === selected) || null

  // Agrupar mensajes por día para mostrar separadores
  const groupedMessages = useMemo(() => {
    const groups: { day: string; items: ChatMessage[] }[] = []
    for (const m of messages) {
      const day = dayLabel(m.fecha)
      const last = groups[groups.length - 1]
      if (last && last.day === day) last.items.push(m)
      else groups.push({ day, items: [m] })
    }
    return groups
  }, [messages])

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      {/* Lista de chats */}
      <div className="w-80 bg-[#151520] border border-purple-500/15 rounded-lg flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-purple-500/10">
          <h1 className="text-white font-serif text-lg font-light mb-3">Leads WPP</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o texto"
            className="w-full bg-[#0a0a0a] border border-purple-500/15 rounded px-3 py-2 text-white/80 text-xs focus:outline-none focus:border-purple-500/40"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <p className="text-white/30 text-sm p-4">Cargando...</p>
          ) : error ? (
            <p className="text-red-400/60 text-xs p-4">{error}</p>
          ) : filteredChats.length === 0 ? (
            <p className="text-white/20 text-xs p-4 text-center">
              {chats.length === 0 ? 'No hay conversaciones todavía' : 'Sin resultados'}
            </p>
          ) : (
            filteredChats.map((chat) => {
              const isActive = chat.telefono === selected
              return (
                <button
                  key={chat.telefono}
                  onClick={() => setSelected(chat.telefono)}
                  className={`w-full text-left px-4 py-3 border-b border-purple-500/5 transition-colors ${
                    isActive ? 'bg-purple-600/15' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white text-sm truncate">
                      {chat.nombre || formatPhone(chat.telefono)}
                    </span>
                    <span className="text-white/30 text-[10px] flex-shrink-0">
                      {formatListTime(chat.ultimaFecha)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white/40 text-xs truncate flex-1">
                      {chat.ultimoTipo === 'out' && <span className="text-purple-300/60">Vos: </span>}
                      {chat.ultimoMensaje}
                    </p>
                    {chat.noLeidos > 0 && (
                      <span className="bg-purple-500 text-white text-[10px] rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                        {chat.noLeidos}
                      </span>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Panel de conversación */}
      <div className="flex-1 bg-[#151520] border border-purple-500/15 rounded-lg flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-purple-300/30 text-5xl mb-3">💬</div>
              <p className="text-white/30 text-sm">Seleccioná una conversación</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header chat */}
            <div className="px-5 py-4 border-b border-purple-500/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm font-medium">
                {(selectedChat?.nombre || selected).slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm truncate">{selectedChat?.nombre || 'Sin nombre'}</p>
                <p className="text-white/40 text-xs">{formatPhone(selected)}</p>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#0a0a0a]/40">
              {loadingChat ? (
                <p className="text-white/30 text-sm text-center">Cargando...</p>
              ) : messages.length === 0 ? (
                <p className="text-white/20 text-xs text-center">Sin mensajes</p>
              ) : (
                groupedMessages.map((group) => (
                  <div key={group.day}>
                    <div className="flex justify-center my-3">
                      <span className="bg-purple-500/10 text-purple-300/60 text-[10px] px-3 py-1 rounded-full">
                        {group.day}
                      </span>
                    </div>
                    {group.items.map((msg) => {
                      const isOut = msg.tipo === 'out'
                      return (
                        <div key={msg.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'} mb-2`}>
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              isOut
                                ? 'bg-purple-600/30 border border-purple-500/20'
                                : 'bg-[#1f1f2e] border border-white/5'
                            }`}
                          >
                            <p className="text-white/90 text-sm whitespace-pre-wrap break-words">{msg.mensaje}</p>
                            <p className="text-white/30 text-[10px] mt-1 text-right">{formatBubbleTime(msg.fecha)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer informativo: solo lectura */}
            <div className="px-5 py-3 border-t border-purple-500/10 bg-[#0a0a0a]">
              <p className="text-white/30 text-[11px] text-center">
                Solo lectura — las respuestas se envían desde la app de WhatsApp
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
