'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PromoPackage {
  id?: number
  date: string
  nights: string
  hotel: string
  location: string
  price: string
  taxes: string
  order: number
}

interface Promo {
  id: number
  title: string
  origin: string
  cardImage: string
  backgroundImage: string
  active: boolean
  order: number
  includes: string[]
  packages: PromoPackage[]
  createdAt?: string
  updatedAt?: string
}

const ICON_OPTIONS = [
  'Aéreos confirmados',
  'Alojamiento',
  'All Inclusive',
  'Traslados',
  'Seguro de viaje',
  'Excursiones',
  'Comidas incluidas',
  'Comidas',
  'Hoteles',
  'Transfer aeropuerto',
  'Tour guiado',
  'Hotel 5 estrellas',
  'Vuelos directos',
  'Asistencia al viajero',
  'Spa incluido',
  'Wi-Fi incluido',
  'Desayuno incluido',
  'Media pensión',
  'Pensión completa',
  'Actividades acuáticas',
  'Personalizado',
]

const JSON_PROMPT = `Vas a recibir una imagen de una oferta de viaje y tenés que extraer la información y devolvérmela en el siguiente formato JSON:

{
  "title": "Nombre del destino",
  "origin": "Ciudad de salida",
  "includes": ["Aéreos confirmados", "Alojamiento", "All Inclusive", "Traslados"],
  "packages": [
    {
      "date": "DD Mes",
      "nights": "X Noches",
      "hotel": "Nombre del Hotel",
      "location": "Ciudad, País",
      "price": "USD X.XXX",
      "taxes": "+ Imp. Aéreos XXX | IVA XXX USD XXX"
    }
  ]
}

Reglas importantes:
- title: no pongas el país/ciudad literalmente, sino la región general a la que pertenece. Ejemplos: Jamaica → Caribe, Cancún → Caribe, París → Europa, Tokio → Asia, Miami → Estados Unidos, etc.
- origin: extraelo de la imagen. Si dice "desde Bs. As." ponés Buenos Aires.
- includes: si la imagen no especifica qué incluye el paquete, usá siempre los valores por defecto: ["Aéreos confirmados", "Alojamiento", "All Inclusive", "Traslados"].
- location: siempre el país o ciudad destino tal como aparece en la imagen (ej: Jamaica, Cancún, Roma).
- taxes: unificá todos los impuestos y códigos en un solo string tal como aparecen en la imagen. Si hay un solo impuesto, ponés únicamente ese. Si no hay ningún impuesto, dejá el campo como string vacío "".
- Si hay más de un hotel/paquete en la imagen, generá un objeto dentro de packages por cada uno.
- Devolvé únicamente el JSON, sin explicaciones adicionales.`

export default function AdminDashboard() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [editing, setEditing] = useState<Promo | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [activeTab, setActiveTab] = useState<'promos' | 'docs'>('promos')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const router = useRouter()

  const fetchPromos = useCallback(async () => {
    const res = await fetch('/api/promos')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setPromos(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchPromos()
  }, [fetchPromos])

  const handleSave = async () => {
    if (!editing) return
    const { id, createdAt, updatedAt, ...rest } = editing
    const packages = rest.packages.map(({ id: _id, ...pkg }) => pkg)
    const body = { ...rest, packages }

    const res = await fetch(isNew ? '/api/promos' : `/api/promos/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setEditing(null)
      setShowPreview(false)
      setJsonInput('')
      fetchPromos()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta promo?')) return
    await fetch(`/api/promos/${id}`, { method: 'DELETE' })
    fetchPromos()
  }

  const toggleActive = async (promo: Promo) => {
    await fetch(`/api/promos/${promo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...promo,
        active: !promo.active,
        packages: promo.packages.map(({ id: _id, ...p }) => p),
      }),
    })
    fetchPromos()
  }

  const movePromo = async (index: number, direction: 'up' | 'down') => {
    const newPromos = [...promos]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newPromos.length) return
    ;[newPromos[index], newPromos[swapIndex]] = [newPromos[swapIndex], newPromos[index]]
    const updates = newPromos.map((p, i) => ({
      ...p,
      order: i,
      packages: p.packages.map(({ id: _id, ...pkg }) => pkg),
    }))
    await Promise.all(
      updates.map((p) =>
        fetch(`/api/promos/${p.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        })
      )
    )
    fetchPromos()
  }

  const handleNew = () => {
    setIsNew(true)
    setJsonInput('')
    setJsonError('')
    setShowPreview(false)
    setShowPrompt(false)
    setEditing({
      id: 0,
      title: '',
      origin: 'Buenos Aires',
      cardImage: '',
      backgroundImage: '',
      active: true,
      order: promos.length,
      includes: ['Aéreos confirmados', 'Alojamiento', 'All Inclusive', 'Traslados'],
      packages: [],
    })
  }

  const parseJson = () => {
    try {
      const data = JSON.parse(jsonInput)
      if (!data.title || !data.packages || !Array.isArray(data.packages)) {
        setJsonError('El JSON debe tener "title" y "packages" como array')
        return
      }
      setEditing({
        ...editing!,
        title: data.title,
        origin: data.origin || editing!.origin,
        includes: data.includes || editing!.includes,
        packages: data.packages.map((p: PromoPackage, i: number) => ({ ...p, order: i })),
      })
      setJsonError('')
      setShowPreview(true)
    } catch {
      setJsonError('JSON inválido. Verificá el formato.')
    }
  }

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'cardImage' | 'backgroundImage'
  ) => {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    setUploading(field)

    // Delete old image from Cloudinary if exists
    const oldUrl = editing[field]
    if (oldUrl && oldUrl.includes('cloudinary.com')) {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: oldUrl }),
      })
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', field === 'cardImage' ? 'card' : 'background')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        setEditing({ ...editing, [field]: url })
      } else {
        const err = await res.json()
        alert(err.error || 'Error al subir imagen')
      }
    } catch {
      alert('Error de conexión al subir imagen. Intentá de nuevo.')
    }
    setUploading(null)
  }

  const clearImage = async (field: 'cardImage' | 'backgroundImage') => {
    if (!editing) return
    const url = editing[field]
    if (url && url.includes('cloudinary.com')) {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
    }
    setEditing({ ...editing, [field]: '' })
  }

  const addPackage = () => {
    if (!editing) return
    setEditing({
      ...editing,
      packages: [
        ...editing.packages,
        { date: '', nights: '', hotel: '', location: '', price: '', taxes: '', order: editing.packages.length },
      ],
    })
  }

  const updateInclude = (index: number, value: string) => {
    if (!editing) return
    const includes = [...editing.includes]
    includes[index] = value
    setEditing({ ...editing, includes })
  }

  const updatePackage = (index: number, field: keyof PromoPackage, value: string) => {
    if (!editing) return
    const packages = [...editing.packages]
    packages[index] = { ...packages[index], [field]: value }
    setEditing({ ...editing, packages })
  }

  const removePackage = (index: number) => {
    if (!editing) return
    setEditing({
      ...editing,
      packages: editing.packages.filter((_, i) => i !== index),
    })
  }

  const logout = async () => {
    document.cookie = 'admin_token=; Max-Age=0; path=/'
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-purple-500/10 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-purple-500/10">
          <Image src="/images/logo-arman.png" alt="Arman Travel" width={160} height={50} className="h-10 w-auto" />
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase mt-2">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('promos')}
            className={`w-full text-left px-4 py-3 rounded text-sm transition-colors ${activeTab === 'promos' ? 'bg-purple-600/20 text-purple-300' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          >
            Promos / Destinos
          </button>
          <a
            href="https://armanbusinessdocs.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-left px-4 py-3 rounded text-sm text-white/40 hover:text-white/70 hover:bg-white/5 flex items-center justify-between"
          >
            Documentos
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </nav>
        <div className="p-4 border-t border-purple-500/10 space-y-2">
          <a href="/" className="block text-center text-white/30 text-xs hover:text-purple-300 transition-colors">
            Volver al sitio
          </a>
          <button onClick={logout} className="w-full text-center text-white/20 text-xs hover:text-red-400 transition-colors">
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'promos' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-white font-serif text-2xl font-light">Promos / Destinos</h1>
              <button onClick={handleNew} className="bg-purple-600 text-white text-xs tracking-[0.15em] uppercase px-6 py-2.5 rounded hover:bg-purple-500 transition-colors">
                + Nueva Promo
              </button>
            </div>

            {loading ? (
              <p className="text-white/30 text-sm">Cargando...</p>
            ) : promos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/20 text-sm mb-4">No hay promos cargadas</p>
                <button onClick={handleNew} className="text-purple-400 text-sm hover:text-purple-300">
                  Crear la primera promo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {promos.map((promo, index) => (
                  <div key={promo.id} className="bg-[#151520] border border-purple-500/15 rounded-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      {promo.cardImage && (
                        <img src={promo.cardImage} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h3 className="text-white font-serif text-base truncate">{promo.title}</h3>
                        <p className="text-white/30 text-[11px]">
                          {promo.origin} · {promo.packages.length} paquetes ·{' '}
                          {promo.active ? <span className="text-green-400">Activa</span> : <span className="text-red-400">Oculta</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => movePromo(index, 'up')} disabled={index === 0} className="text-white/20 hover:text-white/60 disabled:opacity-20 p-1">▲</button>
                      <button onClick={() => movePromo(index, 'down')} disabled={index === promos.length - 1} className="text-white/20 hover:text-white/60 disabled:opacity-20 p-1">▼</button>
                      <button onClick={() => toggleActive(promo)} className="text-white/30 hover:text-yellow-400 text-[11px] border border-white/10 px-2.5 py-1 rounded transition-colors">
                        {promo.active ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button onClick={() => { setIsNew(false); setShowPreview(true); setEditing(promo) }} className="text-white/30 hover:text-purple-300 text-[11px] border border-white/10 px-2.5 py-1 rounded transition-colors">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(promo.id)} className="text-white/30 hover:text-red-400 text-[11px] border border-white/10 px-2.5 py-1 rounded transition-colors">
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-6">
            <div className="w-full max-w-4xl bg-[#111111] border border-purple-500/15 rounded-lg mx-4">
              <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/10">
                <h2 className="text-white font-serif text-xl">{isNew ? 'Nueva Promo' : 'Editar Promo'}</h2>
                <button onClick={() => { setEditing(null); setShowPreview(false); setJsonInput('') }} className="text-white/30 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Step 1: JSON Input */}
                {isNew && !showPreview && (
                  <>
                    {/* Prompt helper */}
                    <div>
                      <button onClick={() => setShowPrompt(!showPrompt)} className="text-purple-400 text-xs hover:text-purple-300 mb-2">
                        {showPrompt ? 'Ocultar' : 'Ver'} prompt para IA
                      </button>
                      {showPrompt && (
                        <div className="bg-[#0a0a0a] border border-purple-500/10 rounded p-4 mb-4">
                          <p className="text-white/30 text-[11px] mb-2">Copiá este prompt y dáselo a la IA junto con el destino que querés:</p>
                          <pre className="text-purple-300/60 text-[11px] whitespace-pre-wrap font-mono">{JSON_PROMPT}</pre>
                          <button onClick={() => navigator.clipboard.writeText(JSON_PROMPT)} className="text-purple-400 text-[10px] mt-2 hover:text-purple-300">
                            Copiar prompt
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-white/40 text-xs block mb-2">Pegá el JSON generado por la IA:</label>
                      <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={12}
                        className="w-full bg-[#0a0a0a] border border-purple-500/15 rounded px-4 py-3 text-white/80 text-xs font-mono focus:outline-none focus:border-purple-500/40 resize-y"
                        placeholder='{ "title": "Caribe", "origin": "Buenos Aires", ... }'
                      />
                      {jsonError && <p className="text-red-400 text-xs mt-2">{jsonError}</p>}
                      <button onClick={parseJson} className="mt-3 bg-purple-600 text-white text-xs uppercase tracking-wider px-6 py-2.5 rounded hover:bg-purple-500 transition-colors">
                        Cargar y previsualizar
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Preview + Images + Icons */}
                {(showPreview || !isNew) && editing && (
                  <>
                    {/* Basic info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs block mb-1.5">Título</label>
                        <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full bg-[#0a0a0a] border border-purple-500/15 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/40" />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs block mb-1.5">Origen</label>
                        <input value={editing.origin} onChange={(e) => setEditing({ ...editing, origin: e.target.value })} className="w-full bg-[#0a0a0a] border border-purple-500/15 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/40" />
                      </div>
                    </div>

                    {/* Images */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs block mb-1.5">Imagen de tarjeta</label>
                        <div className="flex gap-2">
                          <input value={editing.cardImage} onChange={(e) => setEditing({ ...editing, cardImage: e.target.value })} disabled={uploading !== null} className="flex-1 bg-[#0a0a0a] border border-purple-500/15 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/40 disabled:opacity-30" placeholder="URL o subir" />
                          <label className={`text-xs px-3 py-2.5 rounded flex-shrink-0 ${uploading ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' : 'bg-purple-600/30 text-purple-300 cursor-pointer hover:bg-purple-600/50'} transition-colors`}>
                            {uploading === 'cardImage' ? 'Subiendo...' : 'Subir'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'cardImage')} disabled={uploading !== null} />
                          </label>
                        </div>
                        {uploading === 'cardImage' && (
                          <div className="mt-2 h-24 w-full bg-[#0a0a0a] rounded flex items-center justify-center border border-purple-500/10">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
                              <span className="text-purple-300/60 text-xs">Subiendo imagen...</span>
                            </div>
                          </div>
                        )}
                        {!uploading && editing.cardImage && (
                          <div className="relative mt-2">
                            <img src={editing.cardImage} alt="" className="h-24 w-full object-cover rounded" />
                            <button onClick={() => clearImage('cardImage')} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 text-xs">✕</button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-white/40 text-xs block mb-1.5">Imagen de fondo (popup)</label>
                        <div className="flex gap-2">
                          <input value={editing.backgroundImage} onChange={(e) => setEditing({ ...editing, backgroundImage: e.target.value })} disabled={uploading !== null} className="flex-1 bg-[#0a0a0a] border border-purple-500/15 rounded px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/40 disabled:opacity-30" placeholder="URL o subir" />
                          <label className={`text-xs px-3 py-2.5 rounded flex-shrink-0 ${uploading ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' : 'bg-purple-600/30 text-purple-300 cursor-pointer hover:bg-purple-600/50'} transition-colors`}>
                            {uploading === 'backgroundImage' ? 'Subiendo...' : 'Subir'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'backgroundImage')} disabled={uploading !== null} />
                          </label>
                        </div>
                        {uploading === 'backgroundImage' && (
                          <div className="mt-2 h-24 w-full bg-[#0a0a0a] rounded flex items-center justify-center border border-purple-500/10">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-purple-500/40 border-t-purple-400 rounded-full animate-spin" />
                              <span className="text-purple-300/60 text-xs">Subiendo imagen...</span>
                            </div>
                          </div>
                        )}
                        {!uploading && editing.backgroundImage && (
                          <div className="relative mt-2">
                            <img src={editing.backgroundImage} alt="" className="h-24 w-full object-cover rounded" />
                            <button onClick={() => clearImage('backgroundImage')} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 text-xs">✕</button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Icons selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-white/40 text-xs">Iconos incluidos ({editing.includes.length})</label>
                        <button onClick={() => setEditing({ ...editing, includes: [...editing.includes, ICON_OPTIONS[0]] })} className="text-purple-400 text-xs hover:text-purple-300">
                          + Agregar icono
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editing.includes.map((inc, i) => {
                          const isCustom = !ICON_OPTIONS.includes(inc)
                          return (
                            <div key={i} className="flex items-center gap-1">
                              {isCustom ? (
                                <input
                                  value={inc}
                                  onChange={(e) => updateInclude(i, e.target.value)}
                                  className="bg-[#0a0a0a] border border-purple-400/30 rounded px-2 py-2 text-purple-300 text-xs w-36 focus:outline-none focus:border-purple-500/40"
                                  placeholder="Nombre personalizado"
                                />
                              ) : (
                                <select
                                  value={inc}
                                  onChange={(e) => updateInclude(i, e.target.value === 'Personalizado' ? '' : e.target.value)}
                                  className="bg-[#0a0a0a] border border-purple-500/15 rounded px-2 py-2 text-white text-xs focus:outline-none focus:border-purple-500/40"
                                >
                                  {ICON_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              )}
                              <button onClick={() => setEditing({ ...editing, includes: editing.includes.filter((_, idx) => idx !== i) })} className="text-red-400/40 hover:text-red-400 text-xs px-1">
                                ✕
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Active + Order */}
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-purple-600" />
                        <span className="text-white/50 text-sm">Activa</span>
                      </label>
                    </div>

                    {/* Packages editable */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-white/40 text-xs">Paquetes ({editing.packages.length})</label>
                        <button onClick={addPackage} className="text-purple-400 text-xs hover:text-purple-300">+ Agregar paquete</button>
                      </div>
                      <div className="space-y-3">
                        {editing.packages.map((pkg, i) => (
                          <div key={i} className="bg-[#0a0a0a] border border-purple-500/10 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-purple-300/50 text-xs">Paquete {i + 1}</span>
                              <button onClick={() => removePackage(i)} className="text-red-400/40 hover:text-red-400 text-xs">Eliminar</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              <input value={pkg.date} onChange={(e) => updatePackage(i, 'date', e.target.value)} placeholder="Fecha" className="bg-[#151520] border border-purple-500/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/30" />
                              <input value={pkg.nights} onChange={(e) => updatePackage(i, 'nights', e.target.value)} placeholder="Noches" className="bg-[#151520] border border-purple-500/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/30" />
                              <input value={pkg.hotel} onChange={(e) => updatePackage(i, 'hotel', e.target.value)} placeholder="Hotel" className="bg-[#151520] border border-purple-500/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/30" />
                              <input value={pkg.location} onChange={(e) => updatePackage(i, 'location', e.target.value)} placeholder="Ubicación" className="bg-[#151520] border border-purple-500/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/30" />
                              <input value={pkg.price} onChange={(e) => updatePackage(i, 'price', e.target.value)} placeholder="Precio" className="bg-[#151520] border border-purple-500/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/30" />
                              <input value={pkg.taxes} onChange={(e) => updatePackage(i, 'taxes', e.target.value)} placeholder="Impuestos" className="bg-[#151520] border border-purple-500/10 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/30" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-purple-500/10">
                <button onClick={() => { setEditing(null); setShowPreview(false); setJsonInput('') }} className="text-white/30 text-xs border border-white/10 px-5 py-2.5 rounded hover:text-white/60 transition-colors">
                  Cancelar
                </button>
                {(showPreview || !isNew) && (
                  <button onClick={handleSave} disabled={uploading !== null} className="bg-purple-600 text-white text-xs tracking-[0.1em] uppercase px-6 py-2.5 rounded hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    {uploading ? 'Esperando imagen...' : 'Guardar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
