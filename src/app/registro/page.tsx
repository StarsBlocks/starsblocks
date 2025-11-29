'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegistroPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

    // Registro exitoso, redirigir a login
    router.push('/login?registered=true')
  }

  return (
    <main className="auth-shell">
      <div className="auth-panel">
        <div className="auth-heading">
          <h1>Crear cuenta</h1>
          <p>Únete a la comunidad que convierte residuos en recompensas</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}
