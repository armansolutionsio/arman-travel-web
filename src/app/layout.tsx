import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
import ThemeProvider from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Arman Travel | Experiencias de Viaje Exclusivas',
  description:
    'Descubrí experiencias de viaje únicas y exclusivas con Arman Travel. Destinos extraordinarios, servicio personalizado.',
  icons: {
    icon: 'https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306366/arman-travel/site/logo_letra.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased">
        <ThemeProvider>
          {children}
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
