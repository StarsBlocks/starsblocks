'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <main style={styles.container}>
        <p>Cargando...</p>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>StarsBlocks</h1>
        <div style={styles.userInfo}>
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <section style={styles.welcome}>
          <h2>Bienvenido, {session.user?.name}</h2>
          <p>Email: {session.user?.email}</p>
        </section>

        <section style={styles.stats}>
          <div style={styles.statCard}>
            <h3>0 kg</h3>
            <p>Total reciclado</p>
          </div>
          <div style={styles.statCard}>
            <h3>0</h3>
            <p>Tokens ganados</p>
          </div>
          <div style={styles.statCard}>
            <h3>0</h3>
            <p>Transacciones</p>
          </div>
        </section>

        <section style={styles.actions}>
          <h3>Acciones rápidas</h3>
          <div style={styles.actionButtons}>
            <button style={styles.actionBtn}>Registrar reciclaje</button>
            <button style={styles.actionBtnSecondary}>Ver historial</button>
          </div>
        </section>
      </div>
    </main>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  logo: {
    margin: 0,
    color: '#10b981',
    fontSize: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
  },
  welcome: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  actions: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  actionBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  actionBtnSecondary: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    border: '1px solid #10b981',
    color: '#10b981',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
}
