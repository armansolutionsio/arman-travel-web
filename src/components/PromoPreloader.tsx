'use client'

import { useEffect } from 'react'

export default function PromoPreloader() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/promos')
        const promos = await res.json()
        if (!Array.isArray(promos)) return

        const urls: string[] = []
        promos.forEach((p: { cardImage?: string; backgroundImage?: string }) => {
          if (p.cardImage) urls.push(p.cardImage)
          if (p.backgroundImage) urls.push(p.backgroundImage)
        })

        urls.forEach((url) => {
          const img = new window.Image()
          img.src = url
        })
      } catch {}
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
