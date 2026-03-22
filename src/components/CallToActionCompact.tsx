'use client'

export default function CallToActionCompact() {
  const whatsappUrl = process.env.NEXT_PUBLIC_URL_WHATSAPP || '#'

  return (
    <div className="bg-[#151520] rounded-sm py-10 px-8 text-center group mt-14 cta-box">
      <h3 className="font-serif text-xl sm:text-2xl font-light text-white tracking-wide">
        Diseñamos el viaje perfecto para vos
      </h3>
      <div className="w-10 group-hover:w-48 h-px bg-purple-500/50 mx-auto my-5 transition-all duration-700" />
      <p className="text-white/40 text-sm font-light leading-relaxed max-w-md mx-auto">
        Estamos listos para planear tu próxima experiencia. Compartí tu idea
        con nosotros y armamos todo a tu medida.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-7 bg-purple-600 text-white text-[10px] tracking-[0.25em] uppercase px-8 py-3 rounded-sm hover:bg-purple-500 transition-all duration-500 cta-btn"
      >
        Contactanos
      </a>
    </div>
  )
}
