import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import HotelCarousel from '@/components/HotelCarousel'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <HotelCarousel />
      {/* Placeholder para futuras secciones */}
      <section className="h-[50vh] bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
          Proximamente
        </p>
      </section>
    </main>
  )
}
