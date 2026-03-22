import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DestinosHero from '@/components/DestinosHero'
import SpecialOffers from '@/components/SpecialOffers'
import CallToAction from '@/components/CallToAction'

export const metadata = {
  title: 'Nuestros Destinos | Arman Travel',
}

export default function Destinos() {
  return (
    <main>
      <Navbar />
      <DestinosHero />
      <SpecialOffers />
      <CallToAction />
      <Footer />
    </main>
  )
}
