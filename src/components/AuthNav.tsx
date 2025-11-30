import Link from 'next/link'

type AuthNavProps = {
  current?: 'login' | 'register'
}

export function AuthNav({ current }: AuthNavProps) {
  return (
    <header className="dashboard-header auth-nav">
      <h1 className="dashboard-logo">
        <Link href="/">StarBlocks</Link>
      </h1>
      <nav className="auth-nav__links" aria-label="Navegación principal">
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
      </nav>
    </header>
  )
}
