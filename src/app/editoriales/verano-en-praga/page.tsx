import EditorialLayout from '@/components/EditorialLayout'
import Image from 'next/image'

export const metadata = {
  title: 'El verano ideal en Praga | Arman Travel',
}

export default function VeranoPraga() {
  return (
    <EditorialLayout
      title="El verano ideal en Praga"
      subtitle="Todo lo que tenés que saber sobre la ciudad de las 100 torres"
      image="/images/praga.jpg"
    >
      <p>
        Con su historia milenaria, su atmósfera vibrante y una arquitectura que
        parece sacada de un cuento de hadas, Praga es una ciudad que cobra vida
        durante los meses cálidos de verano. Desde recorrer la pintoresca Plaza
        de la Ciudad Vieja hasta hacer un picnic en parques verdes y probar
        delicias checas en mercados callejeros, no faltan experiencias increíbles
        en esta ciudad encantadora.
      </p>

      <h2>Recorré la Plaza de la Ciudad Vieja</h2>
      <Image src="/images/praga-1.jpg" alt="Plaza de la Ciudad Vieja, Praga" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" />
      <p>
        Empezá tu aventura de verano en Praga explorando el corazón de la
        ciudad: la Plaza de la Ciudad Vieja. Esta plaza histórica es un tesoro
        de maravillas arquitectónicas, con torres góticas, iglesias barrocas y
        fachadas coloridas.
      </p>
      <p>
        Caminá por las calles empedradas, deteniéndote a admirar el icónico
        Reloj Astronómico. Subí a la torre y disfrutá de las vistas sublimes
        de la ciudad desde la cima. Y no te olvides de probar un trdelník de
        alguno de los encantadores vendedores callejeros — un pastel checo
        tradicional hecho con masa enrollada en un palo, horneada y cubierta
        con azúcar y nueces.
      </p>

      <h2>Disfrutá de una cerveza checa en un beer garden</h2>
      <Image src="/images/praga-2.jpg" alt="Beer garden en Praga" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" />
      <p>
        Ningún verano en Praga está completo sin probar la bebida más querida
        de la nación: la cerveza. La ciudad cuenta con muchos beer gardens
        animados donde locales y turistas se mezclan para relajarse y
        disfrutar del sol.
      </p>
      <p>
        Sentáte en una mesa al aire libre, empapáte del ambiente alegre y
        saboreá una pinta refrescante de cerveza checa como la famosa Pilsner
        Urquell o Budvar. Riegrovy Sady y Žluté Lázně son dos lugares
        populares donde están garantizadas las buenas birras y un ambiente
        veraniego increíble.
      </p>

      <h2>Alquilá un bote en el río Vltava</h2>
      <p>
        Para una experiencia de verano serena y relajante, disfrutá de la
        tranquilidad del río Vltava alquilando un bote a pedal o a remo.
        Deslizáte por las aguas suaves y dejá que el río te guíe en una
        aventura escénica por la ciudad.
      </p>
      <p>
        Mientras navegás por el centro, vas a disfrutar de vistas de postal
        del Castillo de Praga, el Puente Carlos y la elegante arquitectura
        ribereña. Ya sea que busques un paseo romántico o una salida divertida
        con amigos o familia, alquilar un bote en el Vltava promete una
        aventura de verano memorable.
      </p>

      <h2>Explorá los mercados de productores</h2>
      <p>
        Sumergíte en los sabores y tradiciones de Praga explorando sus
        vibrantes mercados de productores. El popular mercado Havelské Tržiště,
        abierto todos los días, ofrece una amplia variedad de productos
        frescos, snacks tradicionales y artesanías hechas a mano.
      </p>
      <p>
        Recorré los bulliciosos puestos, charlá con los vendedores locales y
        probá especialidades regionales como el jamón de Praga, el queso en
        escabeche y la deliciosa miel. No te olvides de llevar una bolsa
        reutilizable para abastecerte de estos manjares.
      </p>

      <h2>Picnic en el Parque Letná</h2>
      <p>
        Escapáte del ajetreo urbano refugiándote en el Parque Letná, un amplio
        oasis verde con vistas panorámicas de la ciudad. Prepará una canasta de
        picnic llena de delicias locales de alguno de los mercados y encontrá
        un rincón acogedor bajo la sombra de un árbol.
      </p>
      <p>
        Mientras saboreás tu almuerzo, disfrutá de las vistas panorámicas del
        skyline de la ciudad, incluyendo el Castillo de Praga y el río Vltava.
        El Parque Letná también alberga el popular Letná Beer Garden, donde
        podés tomar una cerveza checa fresca rodeado de verde.
      </p>

      <h2>Dónde alojarse</h2>
      <p>
        Para un toque de lujo, el Augustine Hotel en Malá Strana se destaca.
        Ubicado en la hermosa ladera, el Augustine irradia historia y
        sofisticación. Alojado dentro de la Iglesia y Monasterio de Santo
        Tomás del siglo XIII, exhibe con orgullo arte y diseño modernista
        mientras preserva los frescos originales y elementos ornamentales que
        hablan de su herencia.
      </p>
    </EditorialLayout>
  )
}
