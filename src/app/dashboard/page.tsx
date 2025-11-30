'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { UserRecyclingExperience } from '@/components/UserRecyclingExperience'

interface UserData {
  wallet?: string
  totalKg?: number
  totalPoints?: number
  totalTransactions?: number
  privacySettings?: {
    shareStats: boolean
    shareHistory: boolean
    shareLocation: boolean
    allowRankings: boolean
  }
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
  const [consentsSaving, setConsentsSaving] = useState(false)
  const [localConsents, setLocalConsents] = useState({
    shareStats: false,
    shareHistory: false,
    shareLocation: false,
    allowRankings: true,
  })
  const [consentsChanged, setConsentsChanged] = useState(false)

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
    if (!next && settingsButtonRef.current) {
      settingsButtonRef.current.focus()
    }
  }

  const settingsButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && settingsOpen) {
        event.preventDefault()
        toggleSettings()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [settingsOpen])

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

  // Sincronizar localConsents cuando se cargan los datos del usuario
  useEffect(() => {
    if (userData.privacySettings) {
      setLocalConsents(userData.privacySettings)
    }
  }, [userData.privacySettings])

  function handleConsentChange(key: keyof typeof localConsents, value: boolean) {
    setLocalConsents(prev => ({ ...prev, [key]: value }))
    setConsentsChanged(true)
  }

  async function handleSaveConsents() {
    if (!session?.user?.id) return
    
    setConsentsSaving(true)
    
    const res = await fetch('/api/consent', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localConsents)
    })
    
    setConsentsSaving(false)
    
    if (res.ok) {
      setUserData(prev => ({ ...prev, privacySettings: localConsents }))
      setConsentsChanged(false)
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
        <section className="dashboard-section" aria-live="polite">
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
              aria-controls="security-settings-panel"
              ref={settingsButtonRef}
            >
              ⚙️
            </button>
          </div>

          {settingsOpen && (
            <div
              className="settings-panel"
              id="security-settings-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="security-settings-title"
            >
              <h3 id="security-settings-title">Llave privada para apps BSV</h3>
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

          {settingsOpen && (
            <fieldset className="settings-panel__consents">
              <legend>Privacidad y consentimientos</legend>
              
              <label className="settings-consent-item">
                <input
                  type="checkbox"
                  checked={localConsents.allowRankings}
                  onChange={(e) => handleConsentChange('allowRankings', e.target.checked)}
                />
                <span>Aparecer en rankings públicos</span>
              </label>

              <label className="settings-consent-item">
                <input
                  type="checkbox"
                  checked={localConsents.shareStats}
                  onChange={(e) => handleConsentChange('shareStats', e.target.checked)}
                />
                <span>Compartir estadísticas (kg, tokens)</span>
              </label>

              <label className="settings-consent-item">
                <input
                  type="checkbox"
                  checked={localConsents.shareHistory}
                  onChange={(e) => handleConsentChange('shareHistory', e.target.checked)}
                />
                <span>Compartir historial de transacciones</span>
              </label>

              <label className="settings-consent-item">
                <input
                  type="checkbox"
                  checked={localConsents.shareLocation}
                  onChange={(e) => handleConsentChange('shareLocation', e.target.checked)}
                />
                <span>Compartir ubicación/ayuntamiento</span>
              </label>

              <button
                type="button"
                className="settings-panel__save-consents"
                onClick={handleSaveConsents}
                disabled={!consentsChanged || consentsSaving}
              >
                {consentsSaving ? 'Guardando...' : 'Guardar preferencias'}
              </button>
            </fieldset>
          )}
        </section>

        <section className="wallet-card" aria-live="polite">
          <div className="wallet-card__content">
            <div className="wallet-card__qr-section">
              {userData.wallet ? (
                <div className="wallet-card__qr">
                  <QRCodeSVG
                    value={userData.wallet}
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#16a34a"
                    level="M"
                  />
                </div>
              ) : (
                <div className="wallet-card__qr wallet-card__qr--loading">
                  <span>...</span>
                </div>
              )}
            </div>
            <div className="wallet-card__info">
              <span className="wallet-card__label">Tu ID para reciclaje</span>
              <h3 className="wallet-card__title">Escanea o copia tu código</h3>
              <p className="wallet-card__hint">Muestra este QR al recolector para registrar tu reciclaje</p>
              <div className="wallet-card__code-box">
                <code className="wallet-card__code">
                  {userData.wallet
                    ? `${userData.wallet.slice(0, 12)}...${userData.wallet.slice(-8)}`
                    : 'Cargando...'}
                </code>
                <button onClick={copyWallet} className="wallet-card__copy" type="button">
                  {copied ? '¡Copiado!' : 'Copiar ID'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>{userData.totalKg || 0} kg</h3>
            <p>Total reciclado</p>
          </div>
          <div className="stat-card">
            <h3>{(userData.totalPoints ?? 0).toFixed(2)}</h3>
            <p>Puntos ganados</p>
          </div>
          <div className="stat-card">
            <h3>{userData.totalTransactions || 0}</h3>
            <p>Transacciones</p>
          </div>
        </section>

        <UserRecyclingExperience userId={session.user?.id} />

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

        <section className="dashboard-section">
          <h3>Historial de reciclaje</h3>
          {transactions.length === 0 ? (
            <p>No tienes transacciones aún</p>
          ) : (
            <table className="transactions-table" aria-live="polite" aria-label="Transacciones recientes">
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
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
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
