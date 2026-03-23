import EditorialLayout from '@/components/EditorialLayout'
import Image from 'next/image'

export const metadata = {
  title: 'Camboya y Vietnam | Arman Travel',
}

export default function CamboyaVietnam() {
  return (
    <EditorialLayout
      title="Camboya y Vietnam: dos destinos, una sola aventura"
      subtitle="El sabor auténtico del sudeste asiático"
      image="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306403/arman-travel/site/vietnam.webp"
      articleImages={["https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306397/arman-travel/site/vietnam-1.webp", "https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306399/arman-travel/site/vietnam-2.webp"]}
    >
      <p>
        Haciendo frontera con Tailandia y Laos, Camboya y Vietnam están
        preparados para una escapada reveladora. Habiendo superado una
        historia turbulenta, ambos son ahora dos de los destinos más amigables
        y estimulantes del mundo. Acá te contamos por qué deberían ser el foco
        de tu próxima aventura.
      </p>

      <h2>Camboya</h2>
      <Image src="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306397/arman-travel/site/vietnam-1.webp" alt="Templos de Camboya" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        La belleza natural de Camboya oculta su complicado pasado: llanuras
        bajas y selvas tropicales contrastan con los históricos templos de
        Angkor y las instalaciones de detención de la era del Khmer Rojo.
      </p>
      <p>
        Empezá tu viaje en Siem Reap, un pueblo resort en la provincia de
        Angkor con más de 1.000 templos, incluyendo Angkor Wat, el Templo
        Bayón y el menos visitado Banteay Srei. Estas enormes estructuras de
        piedra fueron construidas durante el Imperio Jemer (802-1431 d.C.)
        para los dioses hindúes Shiva y Vishnu.
      </p>
      <p>
        Después, sumergíte en la energía de Phnom Penh, donde las calles
        bullen de actividad. Montones de kuy teav, num banh chok y fish amok
        se sirven en todos lados, desde carritos callejeros hasta restaurantes
        de alta cocina, mostrando la amplitud de la gastronomía camboyana.
      </p>
      <p>
        En el Mercado Central Art Decó vas a encontrar puestos vendiendo
        hermosos productos artesanales, mientras que otros sitios clave
        incluyen el Palacio Real y el Museo Nacional. También encontrarás el
        S-21 y los Killing Fields, memoriales que son una parte sobria pero
        esencial para entender la historia de Camboya.
      </p>
      <p>
        Fuera de las ciudades, playas como Otres y Ou Chheuteal son sitios
        populares para tomar sol, mientras que el island hopping ofrece la
        oportunidad de admirar esta nación sin las multitudes. Para el
        escape definitivo de lujo descalzo, Song Saa Private Island ofrece
        indulgencia eco-consciente en dos islas prístinas.
      </p>

      <h2>Vietnam</h2>
      <Image src="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306399/arman-travel/site/vietnam-2.webp" alt="Vietnam" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Descubrí aldeas tribales en las colinas, metrópolis vibrantes y
        monumentos de la guerra de Vietnam y la era comunista. Para llegar a
        Vietnam con estilo, subíte al crucero de lujo Aqua Mekong desde
        Phnom Penh y desembarcá en Ho Chi Minh.
      </p>
      <p>
        Esta ciudad dinámica lleva el nombre del anterior líder del Partido
        Comunista Vietnamita. Embarcáte en un tour privado para explorar la
        amplitud de la herencia y cultura de la ciudad, o reservá uno de los
        famosos tours en bote hacia el imperdible Delta del Mekong.
      </p>
      <p>
        Esta fértil región presenta un laberinto de ríos, pantanos e islas,
        sobre los cuales vas a encontrar aldeas y mercados flotantes. Mientras
        estés en la región, te sugerimos hospedarte en el Six Senses Ninh Van
        Bay, un resort idílico ubicado en una bahía dramática con vista al Mar
        del Este de Vietnam, accesible únicamente por bote.
      </p>
      <p>
        En el norte de Vietnam, visitá la capital Hanoi, que todavía está
        llena de rastros de su historia francesa, china y del sudeste
        asiático. Agarrá un Trà đá (té verde helado) antes de explorar
        sitios populares como el Barrio Antiguo, la Calle del Tren, el Templo
        de la Literatura y la Prisión Hoa Lo.
      </p>
      <p>
        Después te recomendamos ir a Sa Pa en el noroeste de Vietnam para
        admirar los vastos arrozales antes de explorar la Bahía de Ha Long y
        la isla de Hoi An. Dos países, una sola aventura que te va a cambiar
        la forma de ver el mundo.
      </p>
    </EditorialLayout>
  )
}
