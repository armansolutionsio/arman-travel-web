'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function TravelStyle() {
  return (
    <section className="relative bg-[#0a0a0a] py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            {/* Purple border that expands on hover */}
            <div className="relative group/img">
              <div className="absolute -inset-[1px] rounded-sm border border-purple-500/20 group-hover/img:border-purple-500/50 group-hover/img:-inset-3 transition-all duration-700" />
              <Image
                src="/images/imagen1.jpg"
                alt="Viajá con estilo"
                width={700}
                height={500}
                className="w-full h-[350px] sm:h-[420px] md:h-[480px] lg:h-[540px] object-cover rounded-sm"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="flex flex-col"
          >
            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight tracking-wide">
              Viajá con estilo, viví experiencias únicas
            </h2>

            {/* Purple line - expands on hover */}
            <div className="my-8 md:my-10">
              <div className="w-12 group-hover:w-32 h-px bg-purple-500/50 transition-all duration-700" />
            </div>

            {/* Description */}
            <p className="text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Accedé a los mejores paquetes del Caribe con atención
              personalizada en cada paso. Nosotros nos ocupamos de todo, vos
              solo disfrutás.
            </p>

            {/* CTA */}
            <motion.a
              href="#contacto"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 self-start border border-purple-400/25 text-white text-[10px] sm:text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-purple-600 hover:border-purple-600 transition-all duration-700"
            >
              Conocé más
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
