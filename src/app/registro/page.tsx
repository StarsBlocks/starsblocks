'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthNav } from '@/components/AuthNav'

export default function RegistroPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Consentimientos granulares
  const [consents, setConsents] = useState({
    shareStats: false,
    shareHistory: false,
    shareLocation: false,
    allowRankings: true, // Por defecto activo para gamificación
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      dni: formData.get('dni'),
      privacySettings: consents,
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setLoading(false)

    if (!res.ok) {
      const error = await res.json()
      setError(error.error || 'Error al registrar')
      return
    }

    router.push('/login?registered=true')
  }

  return (
    <>
      <AuthNav current="register" />
      <main className="auth-shell">
        <div className="auth-panel">
          <div className="auth-heading">
            <h1>Crear cuenta</h1>
            <p id="register-description">Únete a la comunidad que convierte residuos en recompensas</p>
          </div>

          {error && (
            <p className="auth-error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit} aria-describedby="register-description">
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">
                Nombre completo
              </label>
              <input
                className="auth-input"
                type="text"
                id="name"
                name="name"
                required
                placeholder="Juana Pérez"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email
              </label>
              <input
                className="auth-input"
                type="email"
                id="email"
                name="email"
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="dni">
                DNI
              </label>
              <input
                className="auth-input"
                type="text"
                id="dni"
                name="dni"
                required
                placeholder="12345678A"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Contraseña
              </label>
              <input
                className="auth-input"
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Consentimientos granulares */}
            <fieldset className="auth-consents">
              <legend className="auth-label">Privacidad y consentimientos</legend>
              
              <label className="auth-consent-item">
                <input
                  type="checkbox"
                  checked={consents.allowRankings}
                  onChange={(e) => setConsents({ ...consents, allowRankings: e.target.checked })}
                />
                <span>Aparecer en rankings públicos</span>
              </label>

              <label className="auth-consent-item">
                <input
                  type="checkbox"
                  checked={consents.shareStats}
                  onChange={(e) => setConsents({ ...consents, shareStats: e.target.checked })}
                />
                <span>Compartir estadísticas (kg reciclados, tokens)</span>
              </label>

              <label className="auth-consent-item">
                <input
                  type="checkbox"
                  checked={consents.shareHistory}
                  onChange={(e) => setConsents({ ...consents, shareHistory: e.target.checked })}
                />
                <span>Compartir historial de transacciones</span>
              </label>

              <label className="auth-consent-item">
                <input
                  type="checkbox"
                  checked={consents.shareLocation}
                  onChange={(e) => setConsents({ ...consents, shareLocation: e.target.checked })}
                />
                <span>Compartir ubicación/ayuntamiento</span>
              </label>

              <p className="auth-consent-note">
                Puedes cambiar estos ajustes en cualquier momento desde tu perfil.
              </p>
            </fieldset>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>

          <p className="auth-link">
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
          </p>
          <p className="auth-link">
            ¿Eres recolector? <Link href="/registro/collector">Regístrate aquí</Link>
          </p>
        </div>
      </main>
    </>
  )
}
