'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProductType {
  _id: string
  name: string
  pointsPerKg: number
}

interface RecentTransaction {
  _id: string
  userName: string
  productName: string
  amount: number
  pointsEarned: number
  txHash?: string
  createdAt: string
}

export default function CollectorDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [products, setProducts] = useState<ProductType[]>([])
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    userWallet: '',
    productTypeId: '',
    amount: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const collectorId = session?.user?.id

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session?.user?.role === 'user') {
      router.push('/dashboard')
    }
  }, [status, session, router])

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

  useEffect(() => {
    async function loadRecentTransactions() {
      if (!collectorId) return
      try {
        const res = await fetch(`/api/transactions?collectorId=${collectorId}`)
        if (res.ok) {
          const data: RecentTransaction[] = await res.json()
          setRecentTransactions(data)
        }
      } catch {
        // ignore silently, the message area already covers user feedback
      }
    }
    loadRecentTransactions()
  }, [collectorId])

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
        collectorId,
      }),
    })

    setLoading(false)

    if (res.ok) {
      const transaction = await res.json()
      setMessage({
        type: 'success',
        text: `Registrado: ${transaction.amount}kg de ${transaction.productName} para ${transaction.userName}. Puntos: ${(transaction.pointsEarned ?? 0).toFixed(2)}`
      })
      setFormData({ userWallet: '', productTypeId: '', amount: '' })
      setRecentTransactions(prev => [transaction, ...prev])
      setCurrentPage(1)
    } else {
      const error = await res.json()
      setMessage({ type: 'error', text: error.error || 'Error al registrar' })
    }
  }

  if (status === 'loading') {
    return (
      <main className="loading-shell">
        <p className="loading-text">Cargando...</p>
      </main>
    )
  }

  if (!session || session.user?.role !== 'collector') {
    return null
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header collector-header">
        <h1 className="dashboard-logo">
          StarsBlocks <span className="collector-badge">Recolector</span>
        </h1>
        <div className="dashboard-user">
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} className="dashboard-logout">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section leaderboard-callout">
          <div>
            <h3>Ranking de ubicaciones</h3>
            <p>Consulta el leaderboard con las comunidades que más reciclan.</p>
          </div>
          <button
            type="button"
            className="leaderboard-button"
            onClick={() => router.push('/leaderboard')}
          >
            Ver leaderboard
          </button>
        </section>

        <section className="dashboard-section" aria-live="polite">
          <h2>Panel de Recolector</h2>
          <p>Email: {session.user?.email}</p>
        </section>

        <section className="dashboard-section" aria-live="polite">
          <h3>Registrar Recolección</h3>

          {message.text && (
            <p
              className={message.type === 'success' ? 'collector-success' : 'auth-error'}
              role={message.type === 'success' ? 'status' : 'alert'}
              aria-live="assertive"
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="collector-form" aria-describedby="collector-form-instructions">
            <p id="collector-form-instructions" className="sr-only">
              Ingresa wallet del usuario, selecciona material y cantidad en kilogramos para registrar.
            </p>
            <div className="collector-field">
              <label className="collector-label" htmlFor="userWallet">
                Wallet del Usuario (NFC)
              </label>
              <input
                className="collector-input"
                type="text"
                id="userWallet"
                value={formData.userWallet}
                onChange={(e) => setFormData({ ...formData, userWallet: e.target.value })}
                required
                placeholder="0x742d35Cc..."
              />
            </div>

            <div className="auth-row">
              <div className="collector-field">
                <label className="collector-label" htmlFor="productTypeId">
                  Tipo de Material
                </label>
                <select
                  className="collector-select"
                  id="productTypeId"
                  value={formData.productTypeId}
                  onChange={(e) => setFormData({ ...formData, productTypeId: e.target.value })}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="collector-field">
                <label className="collector-label" htmlFor="amount">
                  Cantidad (kg)
                </label>
                <input
                  className="collector-input"
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0.1"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="collector-submit">
              {loading ? 'Procesando...' : 'Registrar Recolección'}
            </button>
          </form>
        </section>

        <section className="dashboard-section">
          <h3>Recolecciones recientes</h3>
          {recentTransactions.length === 0 ? (
            <p>No hay recolecciones recientes</p>
          ) : (
            <>
              <table className="transactions-table" aria-live="polite" aria-label="Recolecciones recientes">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Material</th>
                    <th>Cantidad</th>
                    <th>Puntos</th>
                    <th>Blockchain</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((t) => (
                      <tr key={t._id}>
                        <td>{new Date(t.createdAt).toLocaleString()}</td>
                        <td>{t.userName}</td>
                        <td>{t.productName}</td>
                        <td>{t.amount} kg</td>
                        <td>
                          <span className="status-badge status-badge--confirmed">
                            +{(t.pointsEarned ?? 0).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          {t.txHash ? (
                            <a
                              href={`https://whatsonchain.com/tx/${t.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="tx-link"
                            >
                              Ver TX
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {recentTransactions.length > itemsPerPage && (
                <div className="pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {currentPage} de {Math.ceil(recentTransactions.length / itemsPerPage)}
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(recentTransactions.length / itemsPerPage), p + 1))}
                    disabled={currentPage >= Math.ceil(recentTransactions.length / itemsPerPage)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
