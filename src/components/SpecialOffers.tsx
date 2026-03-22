'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const offers = [
  {
    hotel: 'One&Only One Za\'abeel',
    location: 'Dubai, Emiratos Árabes',
    deal: 'Quedáte 4 noches, pagá 3',
  },
  {
    hotel: 'Burj Al Arab',
    location: 'Dubai, Emiratos Árabes',
    deal: 'Quedáte 4 noches, pagá 3',
  },
  {
    hotel: 'One&Only Aesthesis',
    location: 'Glifadha, Grecia',
    deal: 'Quedáte 3 noches, pagá 2',
  },
  {
    hotel: 'Mandarin Oriental Hyde Park',
    location: 'Londres, Reino Unido',
    deal: 'Quedáte 3 noches, pagá 2',
  },
  {
    hotel: 'Raffles The Palm Dubai',
    location: 'Dubai, Emiratos Árabes',
    deal: 'Quedáte 3 noches, pagá 2',
  },
  {
    hotel: 'Capella Bangkok',
    location: 'Bangkok, Tailandia',
    deal: 'Quedáte 3 noches, pagá 2',
  },
  {
    hotel: 'Raffles Dubai',
    location: 'Dubai, Emiratos Árabes',
    deal: 'Quedáte 4 noches, pagá 3',
  },
  {
    hotel: 'The Upper House',
    location: 'Hong Kong, China',
    deal: 'Quedáte 3 noches, pagá 2',
  },
  {
    hotel: 'Shangri-La Singapore',
    location: 'Singapur',
    deal: 'Quedáte 4 noches, pagá 3',
  },
  {
    hotel: 'Rosewood London',
    location: 'Londres, Reino Unido',
    deal: 'Quedáte 4 noches, pagá 3',
  },
  {
    hotel: 'Mandarin Oriental New York',
    location: 'Nueva York, Estados Unidos',
    deal: 'Quedáte 3 noches, pagá 2',
  },
]

export default function SpecialOffers() {
  const firstRow = offers.slice(0, 2)
  const remainingRows = offers.slice(2)

  return (
    <section className="relative bg-[#0a0a0a] py-24 md:py-32">
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
          {firstRow.map((offer, i) => (
            <OfferCard key={offer.hotel} offer={offer} index={i} />
          ))}
        </div>

        {/* Remaining rows: 3 cards each */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {remainingRows.map((offer, i) => (
            <OfferCard key={offer.hotel} offer={offer} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OfferCard({
  offer,
  index,
}: {
  offer: { hotel: string; location: string; deal: string }
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="group/card cursor-pointer bg-[#141414] rounded-lg border-2 border-purple-500/20 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-purple-950/30 hover:border-purple-500/40 transition-all duration-500 overflow-hidden offer-card"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src="/images/miami.jpg"
          alt={offer.hotel}
          width={700}
          height={420}
          className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover/card:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-white font-serif text-lg md:text-xl font-light group-hover/card:text-purple-200 transition-colors duration-300 leading-snug">
          {offer.hotel}
        </h3>
        <div className="flex items-center gap-1.5 mt-2">
          <svg className="w-3.5 h-3.5 text-purple-400/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-white/35 text-sm font-light">
            {offer.location}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
