import Link from 'next/link'

export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>StarsBlocks</h1>
        <p style={styles.subtitle}>Recicla, gana tokens y ayuda al planeta</p>

        <div style={styles.buttons}>
          <Link href="/login" style={styles.btnPrimary}>
            Iniciar Sesión
          </Link>
          <Link href="/registro" style={styles.btnSecondary}>
            Crear Cuenta
          </Link>
        </div>
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  hero: {
    textAlign: 'center',
    padding: '2rem',
  },
  title: {
    fontSize: '3rem',
    color: '#10b981',
    margin: 0,
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem',
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  btnPrimary: {
    padding: '0.75rem 2rem',
    backgroundColor: '#10b981',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  btnSecondary: {
    padding: '0.75rem 2rem',
    backgroundColor: 'white',
    color: '#10b981',
    textDecoration: 'none',
    borderRadius: '4px',
    border: '1px solid #10b981',
    fontSize: '1rem',
  },
}
