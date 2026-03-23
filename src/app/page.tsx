import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import HotelCarousel from '@/components/HotelCarousel'
import TravelStyle from '@/components/TravelStyle'
import DiscoverDestination from '@/components/DiscoverDestination'
import Community from '@/components/Community'
import CallToAction from '@/components/CallToAction'
import Inspiration from '@/components/Inspiration'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'

const homeImages = [
  '/images/imagen1.jpg',
  '/images/imagen2.jpg',
  '/images/imagen3.jpg',
  '/images/mundial.png',
  '/images/praga.jpg',
  '/images/hungria.jpg',
  '/images/desayunos.png',
  '/images/japon.jpg',
  '/images/vietnam.jpg',
  '/images/logo-arman.png',
  '/images/qr-agencia.png',
]

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Preloader urls={homeImages} />
      <About />
      <HotelCarousel />
      <TravelStyle />
      <DiscoverDestination />
      <Community />
      <CallToAction />
      <Inspiration />
      <Footer />
    </main>
  )
}
