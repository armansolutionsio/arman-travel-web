'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import CallToActionCompact from './CallToActionCompact'

import Preloader from './Preloader'

interface EditorialLayoutProps {
  title: string
  subtitle: string
  image: string
  articleImages?: string[]
  children: React.ReactNode
}

export default function EditorialLayout({
  title,
  subtitle,
  image,
  articleImages = [],
  children,
}: EditorialLayoutProps) {
  return (
    <main className="bg-[#0a0a0a]">
      <Navbar />
      <Preloader urls={[image, ...articleImages]} />

      {/* Hero */}
      <section id="editorial-hero" className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-purple-950/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />

        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-12 md:pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide max-w-4xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-white/50 text-base md:text-lg font-light font-serif italic max-w-2xl"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-16 h-px bg-purple-500/50 mt-6"
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="w-full">
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose-editorial"
        >
          {children}
        </motion.div>

        {/* Share section */}
        <div className="mt-14 group/share">
          <div className="w-10 group-hover/share:w-full h-px bg-purple-500/40 transition-all duration-700 mb-5" />
          <div className="flex items-center gap-4">
            <span className="text-white/25 text-[10px] font-light italic">
              Compartir editorial
            </span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(title + ' - Arman Travel')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-purple-300 transition-colors duration-300"
              aria-label="Compartir por WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(title + ' - Arman Travel')}&body=${encodeURIComponent('Mirá esta editorial de Arman Travel')}`}
              className="text-white/25 hover:text-purple-300 transition-colors duration-300"
              aria-label="Compartir por email"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href) }}
              className="text-white/25 hover:text-purple-300 transition-colors duration-300"
              aria-label="Copiar link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
              </svg>
            </button>
          </div>
        </div>

        <CallToActionCompact />

        {/* Back link */}
        <div className="mt-10 group/back">
          <div className="w-10 group-hover/back:w-full h-px bg-purple-500/40 transition-all duration-700 mb-5" />
          <Link
            href="/#inspiracion"
            className="inline-flex items-center gap-2 text-purple-400/60 text-xs tracking-[0.2em] uppercase hover:text-purple-300 transition-colors duration-300"
          >
            <span>&#8592;</span>
            Volver a editoriales
          </Link>
        </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
