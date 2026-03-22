import EditorialLayout from '@/components/EditorialLayout'
import Image from 'next/image'

export const metadata = {
  title: 'La herencia artesanal de Japón | Arman Travel',
}

export default function JaponArtesanal() {
  return (
    <EditorialLayout
      title="La herencia artesanal de Japón que sigue viva hoy"
      subtitle="Porque en Japón, cada objeto cuenta una historia"
      image="/images/japon.jpg"
    >
      <p>
        Si bien los cerezos en flor florecen en todo el mundo, Japón venera su
        llegada de una manera única. La tradición del hanami surgió durante el
        reinado del Emperador Saga y continúa hasta hoy. Los delicados pétalos
        rosados encarnan la impermanencia — duran apenas diez días —
        reflejando el concepto japonés de mono no aware, que contempla la
        naturaleza efímera de la vida.
      </p>

      <h2>Sur de Japón: cerezos en flor junto al mar</h2>
      <Image src="/images/japon-1.jpg" alt="Cerezos en flor, Japón" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" />
      <p>
        El viaje comienza en las regiones más cálidas del sur de Japón, donde
        las flores aparecen primero. Kyushu presenta el Castillo de Kumamoto,
        una fortaleza escalonada rodeada por 1.000 cerezos que proyectan una
        bruma rosada sobre sus formidables murallas de piedra.
      </p>
      <p>
        Okinawa ofrece el Castillo Nakijin, con el contraste entre sus ruinas
        milenarias y los cerezos de tonalidad profunda característicos de la
        isla. El Ritz-Carlton Okinawa brinda alojamiento de lujo inmerso en
        un entorno exuberante.
      </p>

      <h2>Tokio: hanami urbano</h2>
      <p>
        La capital de Japón se transforma durante la temporada de floración.
        Los parques se llenan de personas disfrutando de picnics con delicias
        saborizadas con sakura. Las marcas lanzan ediciones limitadas: KitKat
        ofrece chocolate de cerezo y Starbucks estrena un Frappuccino rosa.
      </p>
      <p>
        Los canales de Nakameguro se convierten en un paisaje de ensueño por
        la noche, donde los visitantes disfrutan de comida de puestos
        callejeros y amazake bajo cerezos iluminados con faroles de papel. El
        Prince Sakura Tower Tokyo ofrece un jardín tranquilo como refugio.
      </p>

      <h2>Osaka y Monte Yoshino</h2>
      <Image src="/images/japon-2.jpg" alt="Osaka, Japón" width={800} height={450} className="w-full h-64 md:h-80 object-cover rounded-sm my-6" />
      <p>
        El Parque del Castillo de Osaka cuenta con 3.000 cerezos enmarcando
        la fortaleza, accesibles mediante el crucero Gozabune donde los
        pétalos se reflejan en el agua. Cerca, el Castillo Himeji, Patrimonio
        de la UNESCO, exhibe su elegante fachada blanca.
      </p>
      <p>
        El Monte Yoshino ofrece una experiencia inmersiva donde miles de
        cerezos cubren la montaña en tonos rosa suaves. El Conrad Osaka ofrece
        vistas desde las alturas y cócteles inspirados en el sakura.
      </p>

      <h2>Norte de Japón: legado samurái</h2>
      <p>
        Kakunodate preserva la herencia samurái junto a cerezos llorones
        originalmente traídos de Kioto hace siglos. El Parque Matsumae en
        Hokkaido cuenta con más de 10.000 cerezos, estableciéndose como un
        destino premier.
      </p>
      <p>
        El Park Hyatt Niseko Hanazono ofrece amenidades de lujo incluyendo
        experiencias privadas de onsen. Japón no es solo un destino, es una
        filosofía de vida que se revela en cada detalle artesanal, cada
        ceremonia del té y cada pétalo que cae.
      </p>
    </EditorialLayout>
  )
}
