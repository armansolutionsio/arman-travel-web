'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Community() {
  return (
    <section id="nosotros" className="relative bg-[#0a0a0a] py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image - left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative group/img">
              <div className="absolute -inset-[1px] rounded-sm border border-purple-500/20 group-hover/img:border-purple-500/50 group-hover/img:-inset-3 transition-all duration-700" />
              <Image
                src="/images/imagen3.jpg"
                alt="Comunidad Arman Travel"
                width={700}
                height={500}
                className="w-full h-[350px] sm:h-[420px] md:h-[480px] lg:h-[540px] object-cover rounded-sm"
              />
            </div>
          </motion.div>

          {/* Text Content - right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="flex flex-col"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight tracking-wide">
              Compartimos la pasión por descubrir el mundo
            </h2>

            <div className="my-8 md:my-10">
              <div className="w-12 group-hover:w-32 h-px bg-purple-500/50 transition-all duration-700" />
            </div>

            <p className="text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Unite a nuestra comunidad en redes sociales y sé el primero en
              acceder a descuentos exclusivos, promociones especiales y destinos
              que no vas a encontrar en ningún otro lado.
            </p>

            <motion.a
              href={process.env.NEXT_PUBLIC_URL_INSTAGRAM || '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 self-start border border-purple-400/25 text-white text-[10px] sm:text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-purple-600 hover:border-purple-600 transition-all duration-700"
            >
              Seguinos
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
