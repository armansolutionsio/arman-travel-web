'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import PromoModal from './PromoModal'

interface PromoPackage {
  date: string
  nights: string
  hotel: string
  location: string
  price: string
  taxes: string
}

interface Promo {
  title: string
  origin: string
  image: string
  cardImage: string
  packages: PromoPackage[]
}

const promos: Promo[] = Array(11).fill({
  title: 'Caribe',
  origin: 'Buenos Aires',
  image: '/images/destinos.png',
  cardImage: '/images/miami.jpg',
  packages: [
    {
      date: '18 Abril',
      nights: '9 Noches',
      hotel: 'Iberostar Waves Dominicana',
      location: 'Punta Cana',
      price: 'USD 2.275',
      taxes: '+ Imp. Aéreos 228 | IVA463 USD 590',
    },
    {
      date: '2 Mayo',
      nights: '10 Noches',
      hotel: 'Bahia Principe Grand Aquamarine',
      location: 'Punta Cana',
      price: 'USD 2.055',
      taxes: '+ Imp. Aéreos 228 | IVA463 USD 499',
    },
    {
      date: '10 Mayo',
      nights: '7 Noches',
      hotel: 'Ocean Coral',
      location: 'Montego Bay',
      price: 'USD 2.139',
      taxes: '+ Imp. Aéreos 232 | IVA463 USD 496',
    },
  ],
})

function getLowestPackage(packages: PromoPackage[]) {
  const sorted = [...packages].sort((a, b) => {
    const numA = parseFloat(a.price.replace(/[^0-9.]/g, '').replace(/\.(?=\d{3})/g, ''))
    const numB = parseFloat(b.price.replace(/[^0-9.]/g, '').replace(/\.(?=\d{3})/g, ''))
    return numA - numB
  })
  return sorted[0]
}

export default function SpecialOffers() {
  const [activePromo, setActivePromo] = useState<number | null>(null)
  const whatsappUrl = process.env.NEXT_PUBLIC_URL_WHATSAPP || '#'
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
          image={promos[activePromo].image}
          packages={promos[activePromo].packages}
          whatsappUrl={whatsappUrl}
        />
      )}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
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

        {/* First row: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {firstRow.map((promo, i) => (
            <OfferCard key={i} promo={promo} index={i} onClick={() => setActivePromo(i)} />
          ))}
        </div>

        {/* Remaining rows: 3 cards each */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {remainingRows.map((promo, i) => (
            <OfferCard key={i + 2} promo={promo} index={i + 2} onClick={() => setActivePromo(i + 2)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OfferCard({
  promo,
  index,
  onClick,
}: {
  promo: Promo
  index: number
  onClick: () => void
}) {
  const cheapest = getLowestPackage(promo.packages)
  const lowestPrice = cheapest?.price || ''
  const lowestNights = cheapest?.nights || ''
  const firstLocation = promo.packages[0]?.location || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onClick={onClick}
      className="group/card cursor-pointer bg-[#151520] rounded-lg border-2 border-purple-500/20 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-purple-950/30 hover:border-purple-500/40 transition-all duration-500 overflow-hidden offer-card"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={promo.cardImage}
          alt={promo.title}
          width={700}
          height={420}
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover/card:scale-105 transition-transform duration-700"
        />
        {/* Nights badge */}
        <span className="promo-badge absolute top-3 left-3 bg-purple-600/80 text-white text-[10px] font-medium px-2.5 py-1 rounded tracking-wide">
          {lowestNights}
        </span>
        {/* Icons bar */}
        <div className="promo-badge absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-4 flex items-center justify-center gap-4 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
            <span className="text-white/90 text-[9px] font-light drop-shadow-sm">Aéreos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
            <span className="text-white/90 text-[9px] font-light drop-shadow-sm">Hotel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 2c-.55 0-1 .45-1 1v5.59c0 .78.47 1.48 1.2 1.78L9 11.12V21c0 .55.45 1 1 1s1-.45 1-1v-9.88l1.8-.75c.73-.3 1.2-1 1.2-1.78V3c0-.55-.45-1-1-1s-1 .45-1 1v4.5h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v4.5H8V3c0-.55-.45-1-1-1zm10 0c-1.68 0-3 1.57-3 3.5V11h1.5v10c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z" />
            </svg>
            <span className="text-white/90 text-[9px] font-light drop-shadow-sm">All Incl.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="text-white/90 text-[9px] font-light drop-shadow-sm">Traslados</span>
          </div>
        </div>
      </div>

      {/* Content */}
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
            <p className="text-white/35 text-sm font-light">
              {firstLocation}
            </p>
          </div>
        </div>
        {/* Price tag */}
        <div className="flex-shrink-0 bg-purple-600/80 rounded px-3 py-2 text-center promo-badge">
          <p className="text-white/60 text-[8px] uppercase tracking-wide">Base doble desde</p>
          <p className="text-white font-sans text-base font-medium tabular-nums mt-0.5">{lowestPrice}</p>
        </div>
      </div>
    </motion.div>
  )
}
