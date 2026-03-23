'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import PromoModal from './PromoModal'
import IncludeIcon from './IncludeIcon'

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
}

function optimizeCloudinaryUrl(url: string, width: number = 600) {
  if (!url || !url.includes('cloudinary.com')) return url
  return url.replace('/upload/', `/upload/w_${width},c_fill,q_auto,f_auto/`)
}

function getLowestPackage(packages: PromoPackage[]) {
  const sorted = [...packages].sort((a, b) => {
    const numA = parseFloat(a.price.replace(/[^0-9.]/g, '').replace(/\.(?=\d{3})/g, ''))
    const numB = parseFloat(b.price.replace(/[^0-9.]/g, '').replace(/\.(?=\d{3})/g, ''))
    return numA - numB
  })
  return sorted[0]
}

// Fallback data when API is not available
const fallbackPromos: Promo[] = Array(11).fill(null).map((_, i) => ({
  id: i,
  title: 'Caribe',
  origin: 'Buenos Aires',
  cardImage: '/images/miami.jpg',
  backgroundImage: '/images/destinos.png',
  active: true,
  order: i,
  includes: ['Aéreos confirmados', 'Alojamiento', 'All Inclusive', 'Traslados'],
  packages: [
    { date: '18 Abril', nights: '9 Noches', hotel: 'Iberostar Waves Dominicana', location: 'Punta Cana', price: 'USD 2.275', taxes: '+ Imp. Aéreos 228 | IVA463 USD 590', order: 0 },
    { date: '2 Mayo', nights: '10 Noches', hotel: 'Bahia Principe Grand Aquamarine', location: 'Punta Cana', price: 'USD 2.055', taxes: '+ Imp. Aéreos 228 | IVA463 USD 499', order: 1 },
    { date: '10 Mayo', nights: '7 Noches', hotel: 'Ocean Coral', location: 'Montego Bay', price: 'USD 2.139', taxes: '+ Imp. Aéreos 232 | IVA463 USD 496', order: 2 },
  ],
}))

export default function SpecialOffers() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [activePromo, setActivePromo] = useState<number | null>(null)
  const whatsappUrl = process.env.NEXT_PUBLIC_URL_WHATSAPP || '#'

  useEffect(() => {
    fetch('/api/promos')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPromos(data)
        } else {
          setPromos(fallbackPromos)
        }
      })
      .catch(() => setPromos(fallbackPromos))
  }, [])

  if (promos.length === 0) return null

  const firstRow = promos.slice(0, 2)
  const remainingRows = promos.slice(2)

  return (
    <section className="relative bg-[#0a0a0a] py-24 md:py-32">
      {activePromo !== null && (
        <PromoModal
          isOpen={true}
          onClose={() => setActivePromo(null)}
          title={promos[activePromo].title}
          origin={promos[activePromo].origin}
          image={promos[activePromo].backgroundImage || '/images/destinos.png'}
          packages={promos[activePromo].packages}
          includes={promos[activePromo].includes}
          whatsappUrl={whatsappUrl}
        />
      )}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-14 md:mb-20 group">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-wide"
          >
            Ofertas Especiales
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-12 group-hover:w-32 h-px bg-purple-500/40 mx-auto mt-6 transition-all duration-700"
          />
        </div>

        {firstRow.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {firstRow.map((promo, i) => (
              <OfferCard key={promo.id} promo={promo} index={i} onClick={() => setActivePromo(i)} />
            ))}
          </div>
        )}

        {remainingRows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {remainingRows.map((promo, i) => (
              <OfferCard key={promo.id} promo={promo} index={i + 2} onClick={() => setActivePromo(i + 2)} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function OfferCard({ promo, index, onClick }: { promo: Promo; index: number; onClick: () => void }) {
  const cheapest = getLowestPackage(promo.packages)
  const lowestPrice = cheapest?.price || ''
  const lowestNights = cheapest?.nights || ''
  const firstLocation = promo.packages[0]?.location || ''

  const preloadBg = () => {
    const bgUrl = promo.backgroundImage || '/images/destinos.png'
    if (bgUrl) {
      const img = new window.Image()
      img.src = bgUrl
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onClick={onClick}
      onMouseEnter={preloadBg}
      onTouchStart={preloadBg}
      className="group/card cursor-pointer bg-[#151520] rounded-lg border-2 border-purple-500/20 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-purple-950/30 hover:border-purple-500/40 transition-all duration-500 overflow-hidden offer-card"
    >
      <div className="relative overflow-hidden">
        <Image
          src={promo.cardImage || '/images/miami.jpg'}
          alt={promo.title}
          width={700}
          height={420}
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover/card:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          loading="lazy"
        />
        <span className="promo-badge absolute top-3 left-3 bg-purple-600/80 text-white text-[10px] font-medium px-2.5 py-1 rounded tracking-wide">
          {lowestNights}
        </span>
        <div className="promo-badge absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-4 flex items-center justify-center gap-4 sm:gap-5">
          {(promo.includes || []).slice(0, 4).map((inc, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <IncludeIcon name={inc} className="w-3.5 h-3.5 drop-shadow-md" />
              <span className="text-white/90 text-[9px] font-light drop-shadow-sm">{inc.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-white font-serif text-lg md:text-xl font-light group-hover/card:text-purple-200 transition-colors duration-300 leading-snug">
            {promo.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg className="w-3.5 h-3.5 text-purple-400/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-white/35 text-sm font-light">{firstLocation}</p>
          </div>
        </div>
        <div className="flex-shrink-0 bg-purple-600/80 rounded px-3 py-2 text-center promo-badge">
          <p className="text-white/60 text-[8px] uppercase tracking-wide">Base doble desde</p>
          <p className="text-white font-sans text-base font-medium tabular-nums mt-0.5">{lowestPrice}</p>
        </div>
      </div>
    </motion.div>
  )
}
