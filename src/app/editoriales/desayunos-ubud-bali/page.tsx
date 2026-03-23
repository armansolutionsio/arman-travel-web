import EditorialLayout from '@/components/EditorialLayout'
import Image from 'next/image'

export const metadata = {
  title: 'Los cinco mejores desayunos de Ubud, Bali | Arman Travel',
}

export default function DesayunosUbud() {
  return (
    <EditorialLayout
      title="Los cinco mejores desayunos de Ubud, Bali"
      subtitle="Sabores auténticos para arrancar el día con energía"
      image="/images/desayunos.png"
    >
      <p>
        Rodeada de arrozales, templos intrincados y estudios de yoga, Ubud es
        el centro espiritual y cultural de Bali en Indonesia. Cuando se trata
        de comer, la gastronomía se adapta al vibe relajado y despreocupado de
        la zona. Hay infinitos cafés lindos, restaurantes y warungs que llenan
        las calles sirviendo tanto cocina indonesia como internacional. En
        Ubud, el desayuno es algo serio y hay muchísimos lugares pintorescos
        donde disfrutarlo.
      </p>

      <h2>1. Zest Ubud</h2>
      <Image src="/images/bali-1.jpg" alt="Desayuno en Ubud, Bali" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Ubicado en lo alto de una colina, el Zest Ubud a base de plantas está
        en una ubicación soñada, dentro de un elegante templo con vistas
        panorámicas a la jungla. El restaurante al aire libre es fresco y
        relajado, ofreciendo las condiciones ideales para escapar del sol
        abrasador.
      </p>
      <p>
        Aunque el menú es completamente vegetal, incluso los amantes de la
        carne van a quedar satisfechos con el extenso menú de desayuno.
        Delicias exóticas y saludables incluyen pan de banana especiado,
        pancakes apilados con mango, coco, banana caramelizada, salsa de
        chocolate y fruta del dragón. Cada plato es una foto perfecta para
        Instagram.
      </p>

      <h2>2. Yellow Flower Café</h2>
      <p>
        Un oasis escondido en lo alto de las escaleras de Penestanan en Ubud.
        La mitad de la diversión de desayunar en el Yellow Flower Café es la
        caminata escénica hasta el lugar. Subí los escalones gigantes, pasando
        hojas de vid colgantes, estatuas ornamentales y estudios de yoga
        pintorescos.
      </p>
      <p>
        Una vez que llegás arriba, tomá refugio en los cómodos almohadones del
        café. Desde lo alto, admirá las vistas panorámicas del verde de abajo.
        Toda la comida se presenta hermosamente, con muchos colores y flores.
        Probá uno de los famosos smoothie bowls de Bali o un desayuno
        indonesio para conectar con la cultura local.
      </p>

      <h2>3. Clear Café</h2>
      <Image src="/images/bali-2.jpg" alt="Clear Café, Ubud" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Con un interior que no desentonaría en Pinterest, entrá al Clear Café
        por su decadente puerta tallada y empapáte de las vistas impresionantes.
        Abajo, sentáte en los coloridos almohadones del piso para un desayuno
        relajado, o subí al primer piso para mesas con vista a las calles
        animadas.
      </p>
      <p>
        Con opciones veganas, vegetarianas y de mariscos, el menú es
        impresionante. El scramble de tofu con tofu marinado a la parrilla,
        hongos, papas asadas con cilantro y salsa ranchera es una opción
        contundente y única. Una vez satisfecho, podés pasar al spa para un
        relajante masaje balinés.
      </p>

      <h2>4. Sayuri Healing Food</h2>
      <p>
        Otro popular lugar vegano es el querido Sayuri Healing Food.
        Considerándose más una comunidad que un restaurante, sirve comida a
        base de plantas, en su mayoría cruda y sin gluten. Todos los
        ingredientes son de origen ético y orgánico.
      </p>
      <p>
        Para uno de los mejores smoothie bowls de Ubud, diseñá el tuyo propio
        eligiendo uno de los deliciosos smoothies disponibles con tu selección
        de toppings crocantes. Y si te tienta algo dulce después del desayuno,
        Sayuri es conocido por su variedad decadente de postres veganos.
      </p>

      <h2>5. Milk & Madu</h2>
      <p>
        Con un mobiliario ultra trendy y sucursales tanto en Ubud como en
        Canggu, Milk & Madu sirve desayunos deliciosos todo el día. Desde
        omelettes enormes hasta brekkie bowls súper saludables repletos de
        superalimentos como bayas de goji y semillas de chía, hay algo para
        cada gusto.
      </p>
      <p>
        ¿Extrañás la carne después de tanta comida vegana y vegetariana?
        Sacáte las ganas con el desayuno especial madu, apilado con huevos
        pochados, panceta crocante, palta pisada y más.
      </p>
    </EditorialLayout>
  )
}
