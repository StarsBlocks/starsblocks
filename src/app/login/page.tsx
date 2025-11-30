'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthNav } from '@/components/AuthNav'

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Si ya está logueado, redirigir según rol
  useEffect(() => {
    if (session?.user) {
      if (session.user.role === 'collector') {
        router.push('/collector/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [session, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.refresh()
    }
  }

  return (
    <>
      <AuthNav current="login" />
      <main className="auth-shell">
        <div className="auth-panel">
          <div className="auth-heading">
            <h1>Iniciar sesión</h1>
            <p id="login-description">Ingresa a tu tablero de reciclaje inteligente</p>
          </div>

          {error && (
            <p className="auth-error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit} aria-describedby="login-description">
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
              <label className="auth-label" htmlFor="password">
                Contraseña
              </label>
              <input
                className="auth-input"
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-link">
            ¿No tienes cuenta? <Link href="/registro">Regístrate</Link>
          </p>
        </div>
      </main>
    </>
  )
}
