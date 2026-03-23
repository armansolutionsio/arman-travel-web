'use client'

import { useEffect } from 'react'

// Preloads images in background so they're cached when the user scrolls to them
export default function Preloader({ urls }: { urls: string[] }) {
  useEffect(() => {
    // Wait 1 second (user is watching the hero video) then start preloading
    const timer = setTimeout(() => {
      urls.forEach((url) => {
        if (!url) return
        const img = new window.Image()
        img.src = url
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [urls])

  return null
}
