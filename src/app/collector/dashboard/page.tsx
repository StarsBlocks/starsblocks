'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProductType {
  _id: string
  name: string
  tokensPerKg: number
}

interface RecentTransaction {
  _id: string
  userName: string
  productName: string
  amount: number
  tokensEarned: number
  createdAt: string
}

export default function CollectorDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [products, setProducts] = useState<ProductType[]>([])
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [formData, setFormData] = useState({
    userWallet: '',
    productTypeId: '',
    amount: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session?.user?.role === 'user') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  // Cargar productos al montar
  useEffect(() => {
    async function loadProducts() {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    }
    loadProducts()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userWallet: formData.userWallet,
        productTypeId: formData.productTypeId,
        amount: parseFloat(formData.amount),
        collectorId: session?.user?.id,
      }),
    })

    setLoading(false)

    if (res.ok) {
      const transaction = await res.json()
      setMessage({
        type: 'success',
        text: `Registrado: ${transaction.amount}kg de ${transaction.productName} para ${transaction.userName}. Tokens: ${transaction.tokensEarned}`
      })
      setFormData({ userWallet: '', productTypeId: '', amount: '' })
      // Añadir a recientes
      setRecentTransactions(prev => [transaction, ...prev].slice(0, 5))
    } else {
      const error = await res.json()
      setMessage({ type: 'error', text: error.error || 'Error al registrar' })
    }
  }

  if (status === 'loading') {
    return (
      <main style={styles.container}>
        <p>Cargando...</p>
      </main>
    )
  }

  if (!session || session.user?.role !== 'collector') {
    return null
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>StarsBlocks <span style={styles.badge}>Recolector</span></h1>
        <div style={styles.userInfo}>
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} style={styles.logoutBtn}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <section style={styles.welcome}>
          <h2>Panel de Recolector</h2>
          <p>Email: {session.user?.email}</p>
        </section>

        <section style={styles.formSection}>
          <h3>Registrar Recolección</h3>

          {message.text && (
            <p style={message.type === 'success' ? styles.success : styles.error}>
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label htmlFor="userWallet">Wallet del Usuario (NFC)</label>
              <input
                type="text"
                id="userWallet"
                value={formData.userWallet}
                onChange={(e) => setFormData({ ...formData, userWallet: e.target.value })}
                required
                style={styles.input}
                placeholder="0x742d35Cc..."
              />
            </div>

            <div style={styles.row}>
              <div style={styles.field}>
                <label htmlFor="productTypeId">Tipo de Material</label>
                <select
                  id="productTypeId"
                  value={formData.productTypeId}
                  onChange={(e) => setFormData({ ...formData, productTypeId: e.target.value })}
                  required
                  style={styles.input}
                >
                  <option value="">Seleccionar...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.tokensPerKg} tokens/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label htmlFor="amount">Cantidad (kg)</label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0.1"
                  step="0.1"
                  style={styles.input}
                  placeholder="0.0"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Procesando...' : 'Registrar Recolección'}
            </button>
          </form>
        </section>

        <section style={styles.recentSection}>
          <h3>Recolecciones recientes</h3>
          {recentTransactions.length === 0 ? (
            <p style={{ color: '#666' }}>No hay recolecciones recientes</p>
          ) : (
            <ul style={styles.transactionList}>
              {recentTransactions.map((t) => (
                <li key={t._id} style={styles.transactionItem}>
                  <strong>{t.userName}</strong> - {t.amount}kg de {t.productName}
                  <span style={styles.tokens}>+{t.tokensEarned} tokens</span>
                </li>
              ))}
            </ul>
          )}
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
    backgroundColor: '#f59e0b',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
  },
  badge: {
    fontSize: '0.75rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    marginLeft: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
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
  formSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  submitBtn: {
    padding: '0.75rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  success: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  recentSection: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
  },
  transactionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  transactionItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokens: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
}
