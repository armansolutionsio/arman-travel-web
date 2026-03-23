'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const articles = [
  {
    title: 'Más que un Mundial: FIFA World Cup 2026',
    description: 'Cada sede tiene secretos que vale la pena descubrir',
    image: '/images/mundial.png',
    href: '/editoriales/mundial-2026',
  },
  {
    title: 'El verano ideal en Praga',
    description: 'La ciudad de las 100 torres te espera con todo su encanto medieval',
    image: '/images/praga.jpg',
    href: '/editoriales/verano-en-praga',
  },
  {
    title: 'Un pueblo de cuento en el corazón de Hungría: Hollókő',
    description: 'La vida simple y auténtica de la Europa de antaño, todavía viva',
    image: '/images/hungria.jpg',
    href: '/editoriales/holloko-hungria',
  },
  {
    title: 'Los cinco mejores desayunos de Ubud, Bali',
    description: 'Sabores auténticos para arrancar el día con energía',
    image: '/images/desayunos.png',
    href: '/editoriales/desayunos-ubud-bali',
  },
  {
    title: 'La herencia artesanal de Japón que sigue viva hoy',
    description: 'Porque en Japón, cada objeto cuenta una historia',
    image: '/images/japon.jpg',
    href: '/editoriales/japon-artesanal',
  },
  {
    title: 'Camboya y Vietnam: dos destinos, una sola aventura',
    description: 'El sabor auténtico del sudeste asiático',
    image: '/images/vietnam.jpg',
    href: '/editoriales/camboya-y-vietnam',
  },
]

export default function Inspiration() {
  return (
    <section id="inspiracion" className="relative bg-[#0a0a0a] py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="text-center mb-14 md:mb-20 group">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-purple-300/50 text-[10px] sm:text-[11px] tracking-[0.35em] uppercase mb-4"
          >
            Editoriales
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-wide"
          >
            Inspiración que te lleva lejos
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-12 group-hover:w-32 h-px bg-purple-500/40 mx-auto mt-6 transition-all duration-700"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article, i) => (
            <Link key={article.title} href={article.href}>
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group/card cursor-pointer"
            >
              {/* Image container */}
              <div className="relative overflow-hidden rounded-sm mb-5">
                <div className="absolute inset-0 border border-purple-500/0 group-hover/card:border-purple-500/30 rounded-sm z-10 transition-all duration-500" />
                <Image
                  src={article.image}
                  alt={article.title}
                  width={600}
                  height={400}
                  className="w-full h-52 sm:h-56 md:h-64 object-cover group-hover/card:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Text */}
              <h3 className="font-serif text-lg md:text-xl font-light text-white group-hover/card:text-purple-200 transition-colors duration-300 leading-snug mb-3">
                {article.title}
              </h3>
              <div className="w-8 group-hover/card:w-full h-px bg-purple-500/40 transition-all duration-700 mb-3" />
              <p className="text-white/35 text-sm font-light">
                {article.description}
              </p>
            </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
