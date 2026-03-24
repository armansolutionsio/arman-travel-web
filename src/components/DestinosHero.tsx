'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function DestinosHero() {
  return (
    <section id="destinos-hero" className="relative h-[100dvh] w-full overflow-hidden bg-black">
      {/* Video Desktop */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://res.cloudinary.com/dxzzdtikq/video/upload/du_28,w_1920,h_1080,c_fill,q_auto,so_0/collection_destinos.jpg"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      >
        <source
          src="https://res.cloudinary.com/dxzzdtikq/video/upload/du_28,w_1920,h_1080,c_fill,q_auto/collection_destinos.mp4"
          type="video/mp4"
        />
      </video>

      {/* Video Mobile */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://res.cloudinary.com/dxzzdtikq/video/upload/du_28,w_480,h_854,c_fill,g_center,q_auto,so_0/collection_destinos.jpg"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        <source
          src="https://res.cloudinary.com/dxzzdtikq/video/upload/du_28,w_480,h_854,c_fill,g_center,q_auto/collection_destinos.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-purple-950/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306360/arman-travel/site/logo-arman.png"
            alt="Arman Travel"
            width={320}
            height={120}
            className="w-44 sm:w-56 md:w-64 lg:w-72 h-auto drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Purple line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-32 h-[2px] bg-purple-500/50 mt-4 mb-3 md:mt-5 md:mb-4"
        />

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="text-white/70 text-xs sm:text-sm tracking-[0.15em] font-light"
        >
          Nuestros destinos
        </motion.p>
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
