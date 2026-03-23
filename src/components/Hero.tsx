'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-[100dvh] w-full overflow-hidden"
    >
      {/* Video Desktop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://res.cloudinary.com/dxzzdtikq/video/upload/w_1920,h_1080,c_fill,g_north,q_auto,so_0/final_portada_mobile_lhoa3d.jpg"
        className="absolute inset-0 w-full h-full object-cover scale-105 hidden md:block"
      >
        <source src="https://res.cloudinary.com/dxzzdtikq/video/upload/w_1920,h_1080,c_fill,g_north,q_auto:best/final_portada_mobile_lhoa3d.mp4" type="video/mp4" />
      </video>

      {/* Video Mobile */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="https://res.cloudinary.com/dxzzdtikq/video/upload/w_480,h_854,c_fill,q_auto,so_0/final_portada_mobile_lhoa3d.jpg"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        <source src="https://res.cloudinary.com/dxzzdtikq/video/upload/w_480,h_854,c_fill,q_auto,f_auto/final_portada_mobile_lhoa3d.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-purple-950/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Tagline with diamond separators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8"
        >
          <span className="text-white/90 text-sm sm:text-base md:text-xl tracking-[0.3em] uppercase font-light">
            Viajá
          </span>
          <span className="text-purple-400/50 text-xs">&#9670;</span>
          <span className="text-white/90 text-sm sm:text-base md:text-xl tracking-[0.3em] uppercase font-light">
            Descubrí
          </span>
          <span className="text-purple-400/50 text-xs">&#9670;</span>
          <span className="text-white/90 text-sm sm:text-base md:text-xl tracking-[0.3em] uppercase font-light">
            Viví
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="text-white/60 text-base sm:text-lg md:text-xl font-light max-w-md md:max-w-2xl leading-relaxed font-serif italic"
        >
          Experiencias de viaje exclusivas diseñadas para quienes buscan lo
          extraordinario
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="/destinos"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
          className="mt-8 md:mt-10 border border-purple-400/25 text-white text-[11px] sm:text-xs tracking-[0.3em] uppercase px-9 sm:px-12 py-4 sm:py-4.5 hover:bg-purple-600 hover:border-purple-600 transition-all duration-700 group"
        >
          <span className="group-hover:tracking-[0.4em] transition-all duration-700">
            Explorá Nuestros Destinos
          </span>
        </motion.a>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase mb-2">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-purple-400/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
