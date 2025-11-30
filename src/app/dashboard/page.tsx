'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserRecyclingExperience } from '@/components/UserRecyclingExperience'

interface UserData {
  wallet?: string
  totalKg?: number
  totalPoints?: number
  totalTransactions?: number
}

interface Transaction {
  _id: string
  productTypeId: string
  amount: number
  pointsEarned: number
  txHash?: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>({})
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [copied, setCopied] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsPassword, setSettingsPassword] = useState('')
  const [settingsError, setSettingsError] = useState('')
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function loadUserData() {
      if (session?.user?.id) {
        const res = await fetch(`/api/users/${session.user.id}`)
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
        }
      }
    }
    loadUserData()
  }, [session])

  useEffect(() => {
    async function loadTransactions() {
      if (session?.user?.id) {
        const res = await fetch(`/api/transactions?userId=${session.user.id}`)
        if (res.ok) {
          const data = await res.json()
          setTransactions(data)
        }
      }
    }
    loadTransactions()
  }, [session])

  function copyWallet() {
    if (userData.wallet) {
      navigator.clipboard.writeText(userData.wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function toggleSettings() {
    const next = !settingsOpen
    setSettingsPassword('')
    setSettingsError('')
    setPrivateKey(null)
    setPrivateKeyCopied(false)
    setSettingsOpen(next)
  }

  async function handlePrivateKeyRequest(e: React.FormEvent) {
    e.preventDefault()
    if (!session?.user?.id || !settingsPassword) {
      setSettingsError('Debes ingresar tu contraseña')
      return
    }

    setSettingsLoading(true)
    setSettingsError('')
    setPrivateKey(null)

    const res = await fetch(`/api/users/${session.user.id}/private-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: settingsPassword })
    })

    setSettingsLoading(false)

    if (res.ok) {
      const data = await res.json()
      setPrivateKey(data.privateKey)
    } else {
      const error = await res.json()
      setSettingsError(error.error || 'No se pudo obtener la llave privada')
    }
  }

  function copyPrivateKey() {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey)
      setPrivateKeyCopied(true)
      setTimeout(() => setPrivateKeyCopied(false), 2000)
    }
  }

  if (status === 'loading') {
    return (
      <main className="loading-shell">
        <p className="loading-text">Cargando...</p>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-logo">StarBlocks</h1>
        <div className="dashboard-user">
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} className="dashboard-logout">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <div className="credentials-header">
            <div>
              <h2>Bienvenido, {session.user?.name}</h2>
              <p>Email: {session.user?.email}</p>
            </div>
            <button
              type="button"
              className="settings-button"
              onClick={toggleSettings}
              aria-expanded={settingsOpen}
              aria-label="Configuración de seguridad"
            >
              ⚙️
            </button>
          </div>

          {settingsOpen && (
            <div className="settings-panel">
              <h3>Llave privada para apps BSV</h3>
              <p className="settings-panel__warning">
                ⚠️ Guarda esta llave en un lugar seguro. Podrás usarla en otras aplicaciones BSV,
                pero perderla significa perder acceso a tus tokens.
              </p>

              <form onSubmit={handlePrivateKeyRequest} className="settings-panel__form">
                <label htmlFor="settings-password">Confirma tu contraseña</label>
                <input
                  id="settings-password"
                  type="password"
                  value={settingsPassword}
                  onChange={(e) => setSettingsPassword(e.target.value)}
                  placeholder="••••••••"
                />
                {settingsError && <p className="settings-panel__error">{settingsError}</p>}
                <div className="settings-panel__actions">
                  <button type="submit" disabled={settingsLoading}>
                    {settingsLoading ? 'Descifrando…' : 'Mostrar llave privada'}
                  </button>
                  <button
                    type="button"
                    className="settings-panel__close"
                    onClick={toggleSettings}
                  >
                    Cerrar
                  </button>
                </div>
              </form>

              {privateKey && (
                <div className="settings-panel__key">
                  <code>{privateKey}</code>
                  <button type="button" onClick={copyPrivateKey}>
                    {privateKeyCopied ? '¡Copiada!' : 'Copiar llave'}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3>Tu ID para reciclaje</h3>
          <p>Muestra este código al recolector para registrar tu reciclaje</p>
          <div className="wallet-box">
            <code className="wallet-code">
              {userData.wallet || 'Cargando...'}
            </code>
            <button onClick={copyWallet} className="wallet-copy">
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>{userData.totalKg || 0} kg</h3>
            <p>Total reciclado</p>
          </div>
          <div className="stat-card">
            <h3>{userData.totalPoints || 0}</h3>
            <p>Puntos ganados</p>
          </div>
          <div className="stat-card">
            <h3>{userData.totalTransactions || 0}</h3>
            <p>Transacciones</p>
          </div>
        </section>

        <UserRecyclingExperience userId={session.user?.id} />

        <section className="dashboard-section">
          <h3>Historial de reciclaje</h3>
          {transactions.length === 0 ? (
            <p>No tienes transacciones aún</p>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cantidad</th>
                  <th>Puntos</th>
                  <th>Blockchain</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td>{t.amount} kg</td>
                    <td>
                      <span className="status-badge status-badge--confirmed">
                        +{t.pointsEarned}
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
          )}
        </section>
      </div>
    </main>
  )
}
