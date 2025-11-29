import Link from 'next/link'

const starCategories = [
  {
    key: 'vidrio',
    label: 'Vidrio',
    description: 'Botellas y frascos transparentes se codifican en verde neón para un seguimiento impecable.',
  },
  {
    key: 'papel',
    label: 'Papel',
    description: 'Cartón y fibras se vuelven bloques celestes para monitorear fardos limpios.',
  },
  {
    key: 'metal',
    label: 'Metal',
    description: 'Latas y chatarra ligera inspiran destellos dorados de alto valor.',
  },
  {
    key: 'aceite',
    label: 'Aceite',
    description: 'Residuos aceitosos brillan en naranja ámbar para activar protocolos de recuperación segura.',
  },
  {
    key: 'envases',
    label: 'Envases',
    description: 'Plásticos multicolor forman el punto violeta para medir el flujo hacia nuevos productos.',
  },
]

export default function Home() {
  return (
    <main className="home-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="home-tag">
            <span role="img" aria-hidden="true">
              🧱
            </span>{' '}
            Temporada 01 · Beta abierta
          </p>

          <h1 className="home-title">Convierte tu reciclaje en una partida infinita.</h1>

          <p className="home-lead">
            StarsBlocks es un juego urbano donde cada botella, lata o tetrabrik se transforma en un
            bloque digital. Documenta tu impacto en blockchain, acumula tokens verdes y reta a tu
            comunidad por el primer puesto del tablero.
          </p>

          <div className="home-cta">
            <Link className="btn btn-primary" href="/registro">
              Crear cuenta gratuita
            </Link>
            <Link className="btn btn-ghost" href="/login">
              Ya tengo una cuenta
            </Link>
          </div>

          <p className="home-footnote">
            Cada bloque almacenado valida peso, origen y categoría del residuo. Tus estadísticas se
            sincronizan en segundos y tu progreso nunca se pierde.
          </p>
        </div>

        <div className="hero-insights">
          <section className="star-lab">
            <header className="star-lab__head">
              <h2>Así se arma la estrella de residuos.</h2>
              <p>
                Observa cómo los bloques de cada material viajan desde el centro y completan los cinco
                puntos de la estrella. Es la misma secuencia que usa la app para validar categorías.
              </p>
            </header>

            <div
              className="star-assembly"
              role="img"
              aria-label="Animación de bloques organizándose en estrella de cinco puntas"
            >
              <div className="star-outline" aria-hidden="true" />
              {starCategories.map((category, index) => (
                <span
                  key={category.key}
                  className={`star-block star-block--${category.key}`}
                  style={{ animationDelay: `${index * 0.35}s` }}
                />
              ))}
            </div>

            <ul className="star-legend">
              {starCategories.map((category) => (
                <li key={category.key}>
                  <span
                    className="legend-swatch"
                    style={{ backgroundColor: `var(--block-${category.key})` }}
                  />
                  <div>
                    <p className="legend-label">{category.label}</p>
                    <p className="legend-description">{category.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          
        </div>
      </section>
    </main>
  )
}
