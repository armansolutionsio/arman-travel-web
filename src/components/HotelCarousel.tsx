'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const hotels = [
  { name: 'Four Seasons', file: 'four-seasons.png' },
  { name: 'The Ritz-Carlton', file: 'ritz-carlton.png' },
  { name: 'Marriott', file: 'marriott.png' },
  { name: 'Hilton', file: 'hilton.svg' },
  { name: 'Iberostar', file: 'iberostar.svg' },
  { name: 'Mandarin Oriental', file: 'mandarin-oriental.svg' },
  { name: 'Park Hyatt', file: 'park-hyatt.png' },
  { name: 'Shangri-La', file: 'shangri-la.svg' },
  { name: 'Aman', file: 'aman.png' },
  { name: 'The Peninsula', file: 'peninsula.svg' },
  { name: 'Waldorf Astoria', file: 'waldorf-astoria.svg' },
  { name: 'Rosewood', file: 'rosewood.png' },
  { name: 'Belmond', file: 'belmond.png' },
  { name: 'Palladium Hotel Group', file: 'palladium.png' },
]

export default function HotelCarousel() {
  return (
    <section className="relative bg-[#0a0a0a] pb-20 md:pb-28 overflow-hidden">
      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-center text-purple-300/70 text-[11px] sm:text-xs tracking-[0.35em] uppercase mb-10 md:mb-14"
      >
        Nuestros Hoteles
      </motion.p>

      {/* Carousel container with fade edges */}
      <div className="relative">
        {/* Fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        {/* Fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex animate-scroll">
          {/* Duplicate the list 3 times for seamless loop */}
          {[...hotels, ...hotels, ...hotels].map((hotel, i) => {
            const isSvg = hotel.file.endsWith('.svg')
            return (
              <div
                key={`${hotel.name}-${i}`}
                className="flex-shrink-0 mx-8 sm:mx-10 md:mx-14 flex items-center justify-center h-12"
              >
                <Image
                  src={`/images/hotels/${hotel.file}`}
                  alt={hotel.name}
                  width={160}
                  height={40}
                  className={`h-7 sm:h-8 md:h-10 w-auto opacity-50 hover:opacity-80 transition-all duration-500 ${
                    isSvg ? '' : 'invert grayscale'
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
