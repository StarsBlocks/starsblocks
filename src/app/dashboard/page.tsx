'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface UserData {
  wallet?: string
  totalKg?: number
  totalTokens?: number
  totalTransactions?: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData>({})
  const [copied, setCopied] = useState(false)

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

  function copyWallet() {
    if (userData.wallet) {
      navigator.clipboard.writeText(userData.wallet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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
        <h1 className="dashboard-logo">StarsBlocks</h1>
        <div className="dashboard-user">
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} className="dashboard-logout">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>Bienvenido, {session.user?.name}</h2>
          <p>Email: {session.user?.email}</p>
        </section>

        <section className="dashboard-section">
          <h3>Tu Wallet (ID para reciclaje)</h3>
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
            <h3>{userData.totalTokens || 0}</h3>
            <p>Tokens ganados</p>
          </div>
          <div className="stat-card">
            <h3>{userData.totalTransactions || 0}</h3>
            <p>Transacciones</p>
          </div>
        </section>

        <section className="dashboard-section">
          <h3>Acciones rápidas</h3>
          <div className="dashboard-actions">
            <button className="btn-action btn-action--secondary">Ver historial</button>
          </div>
        </section>
      </div>
    </main>
  )
}
