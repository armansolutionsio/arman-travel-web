'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section className="relative bg-[#0a0a0a] py-24 md:py-32 lg:py-40">
      <div className="max-w-3xl mx-auto px-6 text-center group">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-12 group-hover:w-full h-px bg-purple-500/40 mx-auto mb-10 md:mb-14 transition-all duration-700"
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-light text-white leading-tight tracking-wide"
        >
          Viajes que se sienten diferentes
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mt-7 md:mt-9 text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed"
        >
          En Arman Travel transformamos cada viaje en una experiencia que
          vas a recordar toda la vida. Destinos increíbles, hoteles cuidadosamente
          elegidos y el servicio personalizado que merecés.
        </motion.p>

        {/* Decorative line bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="w-12 group-hover:w-full h-px bg-purple-500/40 mx-auto mt-10 md:mt-14 transition-all duration-700"
        />
      </div>
    </section>
  )
}
