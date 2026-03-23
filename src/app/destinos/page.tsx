import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DestinosHero from '@/components/DestinosHero'
import SpecialOffers from '@/components/SpecialOffers'
import CallToAction from '@/components/CallToAction'
import PromoPreloader from '@/components/PromoPreloader'

export const metadata = {
  title: 'Nuestros Destinos | Arman Travel',
}

export default function Destinos() {
  return (
    <main>
      <Navbar />
      <DestinosHero />
      <PromoPreloader />
      <SpecialOffers />
      <CallToAction />
      <Footer />
    </main>
  )
}
