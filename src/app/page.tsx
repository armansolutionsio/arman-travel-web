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

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
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
