'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Credenciales inválidas')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Image
            src="/images/logo-arman.png"
            alt="Arman Travel"
            width={200}
            height={70}
            className="h-16 w-auto mx-auto mb-6"
          />
          <p className="text-white/30 text-xs tracking-[0.2em] uppercase">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#151520] border border-purple-500/20 rounded px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#151520] border border-purple-500/20 rounded px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white text-xs tracking-[0.2em] uppercase py-3.5 rounded hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
