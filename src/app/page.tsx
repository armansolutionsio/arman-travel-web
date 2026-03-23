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
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306344/arman-travel/site/imagen1.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306348/arman-travel/site/imagen2.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306350/arman-travel/site/imagen3.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306383/arman-travel/site/mundial.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306389/arman-travel/site/praga.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306340/arman-travel/site/hungria.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306330/arman-travel/site/desayunos.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306359/arman-travel/site/japon.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306403/arman-travel/site/vietnam.webp',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306360/arman-travel/site/logo-arman.png',
  'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306390/arman-travel/site/qr-agencia.png',
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
