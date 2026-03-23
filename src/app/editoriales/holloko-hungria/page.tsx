import EditorialLayout from '@/components/EditorialLayout'
import Image from 'next/image'

export const metadata = {
  title: 'Hollókő, Hungría | Arman Travel',
}

export default function HollokoHungria() {
  return (
    <EditorialLayout
      title="Un pueblo de cuento en el corazón de Hungría: Hollókő"
      subtitle="La vida simple y auténtica de la Europa de antaño, todavía viva"
      image="/images/hungria.jpg"
      articleImages={["/images/holloko-1.jpg", "/images/holloko-2.jpg"]}
    >
      <p>
        La frase &quot;viajar en el tiempo&quot; se usa demasiado, pero Hollókő
        realmente la ejemplifica. Este pueblo singular representa una foto viva
        de la vida rural centroeuropea de antes de la transformación agrícola
        del siglo XX. La UNESCO reconoce a Hollókő como evidencia de
        &quot;formas tradicionales de vida rural&quot; que han desaparecido en
        gran parte del resto de Europa.
      </p>

      <h2>Arquitectura y cultura Palócz</h2>
      <Image src="/images/holloko-1.jpg" alt="Arquitectura de Hollókő" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Múltiples incendios catastróficos, siendo el último en 1909,
        destruyeron y reconstruyeron el pueblo. Sin embargo, funciona como una
        comunidad activa y no como un museo estático. Cincuenta y cinco
        estructuras protegidas por la UNESCO permanecen en pie, con
        &quot;techos a dos aguas escalonados y galerías de madera decoradas con
        tallados calados&quot;.
      </p>
      <p>
        Estas casas campesinas de tres ambientes — cocina, despensa y sala de
        estar — ahora albergan principalmente talleres de artesanías y
        espacios de exposición. Más allá del asentamiento histórico está el
        &quot;Pueblo Nuevo&quot;, donde vive la mayoría de los residentes.
      </p>

      <h2>Una comunidad viva con un pasado intenso</h2>
      <p>
        Las guías describen a Hollókő como un &quot;asentamiento tradicional
        deliberadamente preservado&quot;. Recorrer su antigua configuración de
        una sola calle te transporta a tiempos previos a la revolución
        agrícola, cuando familias multigeneracionales cultivaban
        colectivamente.
      </p>
      <p>
        Las ruinas del castillo del siglo XIII ofrecen vistas panorámicas de
        los huertos locales, viñedos y los valles del Parque Nacional Bükk.
        Según la leyenda, los ocupantes del castillo secuestraron a una
        doncella, a quien su nodriza rescató con ayuda sobrenatural,
        &quot;llevándose las piedras del castillo una por una&quot;. Hollókő
        se traduce como &quot;piedra del cuervo&quot; — una escultura recibe a
        los visitantes en la entrada del pueblo.
      </p>

      <h2>Qué ver en tu visita</h2>
      <p>
        El Festival de Pascua de Hollókő ocurre el primer fin de semana de
        abril, celebrando la costumbre húngara tradicional del Locsolkodás. Los
        solteros del pueblo &quot;rocían&quot; a las chicas vestidas con ropa
        colorida con agua, acompañados de actuaciones folclóricas.
      </p>
      <p>
        Las temporadas más tranquilas son ideales para explorar pausadamente el
        museo del pueblo, la antigua escuela, el castillo y la Iglesia de San
        Martín del siglo XIX. Atracciones adicionales incluyen una quesería
        artesanal, la casa de tejido Guzsalyas y un museo de muñecas.
      </p>

      <h2>Delicias gastronómicas</h2>
      <p>
        La temporada turística trae vendedores callejeros que venden pan
        Langallo, junto con establecimientos que sirven Retes (strudels
        húngaros), Csoroge (masa frita) y Batyu (pastelitos dulces de
        ricota). También podés probar el queso ahumado Parenyica o una
        reconfortante sopa Gulyás condimentada con pimentón.
      </p>
      <p>
        Los amantes del vino pueden degustar el Tokaji Aszú 6 Puttonyos,
        descrito como &quot;dulce y amelado&quot;, o el reconocido Tokaji
        Furmint. Los viajeros más aventureros pueden probar el licor Zwak
        Unicum, una mezcla potente de amargos cargada de hierbas y especias.
      </p>
      <p>
      <Image src="/images/holloko-2.jpg" alt="Hollókő, Hungría" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
        <strong>Cómo llegar:</strong> Hospedáte en el Ritz-Carlton Budapest y
        contratá transporte a Hollókő (aproximadamente 90 minutos),
        atravesando la pintoresca cordillera de Cserhát.
      </p>
    </EditorialLayout>
  )
}
