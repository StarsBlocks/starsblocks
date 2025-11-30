'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

type AuthNavProps = {
  current?: 'login' | 'register'
}

export function AuthNav({ current }: AuthNavProps) {
  const { data: session, status } = useSession()

  // Determinar a qué dashboard redirigir según el rol
  const getDashboardUrl = () => {
    if (session?.user?.role === 'collector') {
      return '/collector/dashboard'
    }
    return '/dashboard'
  }

  return (
    <header className="dashboard-header auth-nav">
      <h1 className="dashboard-logo">
        <Link href="/">StarBlocks</Link>
      </h1>
      <nav className="auth-nav__links" aria-label="Navegación principal">
        {status === 'loading' ? (
          <span className="auth-nav__loading">...</span>
        ) : session ? (
          <Link href={getDashboardUrl()} className="auth-nav__link auth-nav__link--back">
            ← Volver al dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/registro"
              className={
                current === 'register' ? 'auth-nav__link auth-nav__link--active' : 'auth-nav__link'
              }
            >
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className={current === 'login' ? 'auth-nav__link auth-nav__link--active' : 'auth-nav__link'}
            >
              Iniciar sesión
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
