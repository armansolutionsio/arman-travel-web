'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import IncludeIcon from './IncludeIcon'

interface PromoPackage {
  date: string
  nights: string
  hotel: string
  location: string
  price: string
  taxes: string
}

interface PromoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  origin: string
  image: string
  packages: PromoPackage[]
  includes?: string[]
  whatsappUrl: string
}

export default function PromoModal({
  isOpen,
  onClose,
  title,
  origin,
  image,
  packages,
  includes = ['Aéreos confirmados', 'Alojamiento', 'All Inclusive', 'Traslados'],
  whatsappUrl,
}: PromoModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 sm:inset-4 md:inset-8 lg:inset-14 z-[101] rounded-none sm:rounded-lg overflow-hidden flex flex-col promo-modal"
          >
            {/* Background image */}
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/75" />
            <div className="absolute inset-0 bg-purple-950/20" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 border border-white/15 flex items-center justify-center hover:bg-purple-600/60 transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-14 pb-6 sm:px-6 sm:pt-8 sm:pb-6 md:px-10 md:pt-10 lg:px-12 flex flex-col items-center">
              {/* Header - always visible */}
              <div className="flex-shrink-0 text-center w-full">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-wide text-center mb-1 sm:mb-2">
                  {title}
                </h2>
                <p className="text-purple-300/70 text-xs sm:text-sm tracking-[0.2em] uppercase mb-2 sm:mb-3">
                  Desde {origin}
                </p>
                <div className="w-16 sm:w-20 h-[2px] bg-purple-500/50 mx-auto mb-4 sm:mb-5 md:mb-6" />
              </div>

              {/* Incluye icons - dynamic */}
              <div className={`grid gap-3 sm:gap-5 mb-4 sm:mb-6 md:mb-8 w-full max-w-md sm:max-w-3xl ${includes.length <= 4 ? 'grid-cols-4' : `grid-cols-${Math.min(includes.length, 6)}`}`} style={{ gridTemplateColumns: `repeat(${Math.min(includes.length, 6)}, minmax(0, 1fr))` }}>
                {includes.map((inc, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-300">
                      <IncludeIcon name={inc} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-white/50 text-[8px] sm:text-[10px] font-light tracking-wide leading-tight">{inc}</p>
                  </div>
                ))}
              </div>

              {/* Packages */}
              <div className="w-full max-w-4xl space-y-2 sm:space-y-3">
                {packages.map((pkg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="bg-white/[0.06] backdrop-blur-sm border border-purple-500/15 rounded-lg px-4 sm:px-6 py-3 sm:py-3.5 hover:border-purple-500/30 transition-all duration-300"
                  >
                    {/* Mobile layout: stacked */}
                    <div className="flex sm:hidden flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-serif text-base font-light">{pkg.hotel}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <svg className="w-2.5 h-2.5 text-purple-400/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <p className="text-white/40 text-[10px] font-light">{pkg.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-sans text-xl font-light tabular-nums">{pkg.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        <p className="text-white/50 text-xs font-light">{pkg.date} · {pkg.nights}</p>
                        <p className="text-white/25 text-[9px] font-light">{pkg.taxes}</p>
                      </div>
                    </div>

                    {/* Desktop layout: row */}
                    <div className="hidden sm:flex items-center justify-between gap-4">
                      <div className="flex-shrink-0 w-28">
                        <p className="text-white font-sans text-base font-light">{pkg.date}</p>
                        <p className="text-white/40 text-xs font-light">{pkg.nights}</p>
                      </div>
                      <div className="flex-1 px-6">
                        <p className="text-white font-serif text-lg font-light">{pkg.hotel}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <svg className="w-3 h-3 text-purple-400/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <p className="text-white/40 text-xs font-light">{pkg.location}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[10px] text-white/30 uppercase tracking-wide">Base doble desde</p>
                        <p className="text-white font-sans text-2xl font-light tabular-nums">{pkg.price}</p>
                        <p className="text-white/30 text-[10px] font-light">{pkg.taxes}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 sm:mt-8 md:mt-10 bg-purple-600 text-white text-[10px] sm:text-xs tracking-[0.25em] uppercase px-8 sm:px-10 py-3 sm:py-4 rounded-sm hover:bg-purple-500 transition-all duration-500 cta-btn"
              >
                Consultá por esta promo
              </motion.a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
