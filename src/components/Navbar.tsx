'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { name: 'Inicio', href: '/#inicio' },
  { name: 'Destinos', href: '/destinos' },
  { name: 'Experiencias', href: '/#inspiracion' },
  { name: 'Nosotros', href: '/#nosotros' },
  { name: 'Contacto', href: '/#footer' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="/#inicio" className="relative z-[60]">
          <Image
            src="/images/logo-arman.png"
            alt="Arman Travel"
            width={300}
            height={100}
            className={`transition-all duration-500 ${
              scrolled ? 'h-14 md:h-16' : 'h-20 md:h-28'
            } w-auto`}
            priority
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white/70 hover:text-purple-300 text-[11px] tracking-[0.2em] uppercase font-light transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-500 group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </div>

        {/* CTA Desktop + Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/#footer"
            className="border border-purple-500/30 text-white text-[10px] tracking-[0.25em] uppercase px-6 py-2.5 hover:bg-purple-600 hover:border-purple-600 hover:text-white transition-all duration-500"
          >
            Reservar
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile: Theme Toggle + Hamburger */}
        <div className="lg:hidden flex items-center gap-2 relative z-[60]">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
            aria-label="Menu"
        >
          <span
            className={`block w-6 h-[1px] bg-white transition-all duration-300 origin-center ${
              mobileOpen ? 'rotate-45 translate-y-[3px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-[1px] bg-white transition-all duration-300 ${
              mobileOpen ? 'opacity-0 scale-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-[1px] bg-white transition-all duration-300 origin-center ${
              mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''
            }`}
          />
          </button>
        </div>
      </div>

      {/* Mobile Menu Fullscreen */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center lg:hidden"
          >
            <div className="flex flex-col items-center gap-7">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-white text-xl tracking-[0.3em] uppercase font-light"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                href="/#footer"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
                onClick={() => setMobileOpen(false)}
                className="border border-purple-500/30 text-white text-xs tracking-[0.25em] uppercase px-8 py-3 mt-4 hover:bg-purple-600 hover:border-purple-600 transition-all duration-500"
              >
                Reservar
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
