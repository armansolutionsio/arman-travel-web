import EditorialLayout from '@/components/EditorialLayout'
import Image from 'next/image'

export const metadata = {
  title: 'Más que un Mundial: FIFA World Cup 2026 | Arman Travel',
}

export default function Mundial2026() {
  return (
    <EditorialLayout
      title="Más que un Mundial: FIFA World Cup 2026"
      subtitle="Cada sede tiene secretos que vale la pena descubrir"
      image="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306383/arman-travel/site/mundial.webp"
      articleImages={["https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306369/arman-travel/site/mexico-city.webp", "https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306393/arman-travel/site/vancouver.webp", "https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306372/arman-travel/site/miami.webp"]}
    >
      <p>
        Con el Mundial 2026 cada vez más cerca, es el momento perfecto para
        asegurar no solo tus entradas y vuelos, sino las experiencias que van a
        hacer de tu viaje algo realmente inolvidable. Entre partido y partido,
        alejate de los estadios y sumergite en la cultura, la gastronomía y el
        carácter de cada ciudad sede.
      </p>

      <h2>Ciudad de México</h2>
      <Image src="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306369/arman-travel/site/mexico-city.webp" alt="Ciudad de México" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Ciudad de México vibra con una energía constante y magnética: una ciudad
        donde la pasión por el fútbol y una escena gastronómica de clase mundial
        conviven felizmente. Hospedáte en el Four Seasons Hotel México City, un
        santuario estilo hacienda sobre el Paseo de la Reforma, perfectamente
        ubicado para explorar Polanco, Condesa y el Parque de Chapultepec entre
        partidos.
      </p>
      <p>
        Equilibrá la adrenalina de las fan zones con una tarde de tour privado
        que revele los highlights culturales y culinarios de la ciudad. Tu guía
        te va a llevar por barrios vibrantes y mercados locales, con paradas
        para probar tacos, tlacoyos y quesadillas recién hechas que elevan la
        comida callejera a una forma de arte.
      </p>

      <h2>Vancouver</h2>
      <Image src="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306393/arman-travel/site/vancouver.webp" alt="Vancouver" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Vancouver es un enclave urbano elegante enmarcado por algunos de los
        paisajes más dramáticos de Norteamérica. Un viaje corto te lleva a
        Granville Island, donde podés alquilar un kayak y deslizarte por las
        aguas calmas de False Creek, disfrutando del skyline desde una
        perspectiva única a nivel del mar.
      </p>
      <p>
        De vuelta en tierra firme, recorré los estudios artesanales y el
        animado Public Market, donde productores locales y puestos de comida
        muestran lo mejor de British Columbia.
      </p>

      <h2>Área de la Bahía</h2>
      <p>
        Desde el Área de la Bahía estás a un paso del Valle de Napa y sus
        viñedos más prestigiosos — un contraste irresistible con el rugido del
        estadio. Dedicá un día a una degustación privada en una bodega como Clos
        du Val, célebre por su elegante Cabernet Sauvignon.
      </p>
      <p>
        Este año además se celebra el centenario de la Ruta 66, la excusa
        perfecta para convertir tu escapada mundialista en un road trip
        americano clásico. Pueblos chicos, diners retro y desiertos infinitos
        que se sienten a un mundo de distancia del Silicon Valley.
      </p>

      <h2>Miami</h2>
      <Image src="https://res.cloudinary.com/ddu5kh0ov/image/upload/v1774306372/arman-travel/site/miami.webp" alt="Miami" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" sizes="(max-width: 768px) 100vw, 720px" quality={80} />
      <p>
        Las raíces latinas de Miami hacen que durante el Mundial la ciudad se
        sienta como una inmensa fan zone bañada por el sol. Esperá
        proyecciones nocturnas, celebraciones espontáneas en la calle y la
        energía eléctrica de hinchas de toda Latinoamérica.
      </p>
      <p>
        Instalate en The Miami Beach EDITION, un refugio frente al océano en
        Collins Avenue que combina sofisticación playera con un pulso social
        vibrante. Entre partidos, dejáte llevar entre sus piscinas, spa y
        playa, y después de caer el sol disfrutá de la gastronomía de
        Jean-Georges y el acceso directo a la vida nocturna más animada de
        Miami.
      </p>

      <h2>Nueva York</h2>
      <p>
        Para cuando se juegue la final, Nueva York va a ser el epicentro del
        fútbol mundial, con invitados VIP y fanáticos haciendo el viaje de su
        vida. Es la excusa perfecta para dedicar un día o dos al shopping en
        una de las ciudades más conscientes del estilo del mundo.
      </p>
      <p>
        Directo a Bergdorf Goodman en la Quinta Avenida, una institución de
        120 años que sigue siendo referente del retail de lujo. Su equipo de
        estilistas ofrece un servicio altamente personalizado, asegurando que
        llegues a la final y sus celebraciones impecablemente vestido.
      </p>

      <h2>Viví el torneo con estilo</h2>
      <p>
        Mientras cada ciudad sede ofrece experiencias memorables, el drama del
        torneo sigue siendo el corazón del viaje. Para quienes buscan una forma
        más elevada de vivir la acción, en Arman Travel tenemos paquetes
        premium de hospitalidad disponibles en las principales ciudades sede.
        Estas experiencias combinan la emoción del fútbol de primer nivel con
        comodidad refinada, servicio excepcional y la oportunidad de compartir
        la ocasión con otros viajeros exigentes.
      </p>
    </EditorialLayout>
  )
}
