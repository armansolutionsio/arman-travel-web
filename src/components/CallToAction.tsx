'use client'

import { motion } from 'framer-motion'

export default function CallToAction() {
  const whatsappUrl = process.env.NEXT_PUBLIC_URL_WHATSAPP || '#'

  return (
    <section className="relative bg-[#151520] py-20 md:py-28 cta-box">
      <div className="max-w-2xl mx-auto px-6 md:px-8 text-center group">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight tracking-wide"
        >
          Diseñamos el viaje perfecto para vos
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-12 group-hover:w-64 h-px bg-purple-500/50 mx-auto my-7 md:my-9 transition-all duration-700"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/45 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto"
        >
          Estamos listos para planear tu próxima experiencia. Compartí tu idea
          con nosotros y armamos todo a tu medida, desde el primer detalle
          hasta el último.
        </motion.p>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-block mt-10 bg-purple-600 text-white text-xs tracking-[0.25em] uppercase px-10 py-4 rounded-sm hover:bg-purple-500 transition-all duration-500 cta-btn"
        >
          Contactanos
        </motion.a>
      </div>
    </section>
  )
}
