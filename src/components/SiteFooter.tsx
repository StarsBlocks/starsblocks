import Image from 'next/image'
import Link from 'next/link'

type SiteFooterProps = {
  variant?: 'global' | 'inline'
}

export function SiteFooter({ variant = 'global' }: SiteFooterProps) {
  const footerClass = ['site-footer', variant === 'inline' ? 'site-footer--inline' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <footer className={footerClass}>
      <div className="site-footer__brand">
        <Image
          src="/logo.jpg"
          alt="Logo de StarBlocks"
          width={36}
          height={36}
          className="site-footer__logo"
        />
        <div>
          <p className="site-footer__title">StarBlocks</p>
          <p className="site-footer__subtitle">Convierte tu reciclaje en bloques digitales</p>
        </div>
      </div>

      <nav className="site-footer__links" aria-label="Enlaces legales">
        <Link href="/privacidad">Política de privacidad</Link>
        <Link href="/terminos">Términos y condiciones</Link>
      </nav>
    </footer>
  )
}
