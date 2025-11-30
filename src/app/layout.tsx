import type { Metadata } from 'next'
import './globals.css'
import { GlobalFooter } from '@/components/GlobalFooter'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'StarBlocks',
  // Este programa se interpeta y rige conforme a la legislación vigente en el Reino de España.
  // Para cualquier controversia derivada del mismo, las partes se someten, salvo expresa derogación de ley, a la jurisdicción de los juzgados y tribunales de Madrid.
  description: 'Convierte tu reciclaje en bloques digitales y compite por el primer puesto.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: ['/logo.jpg'],
  },
}

// Este programa proporciona un servicio en régimen de arrendamiento conforme a lo establecido por el art. 1544 del código civil español.
// Cualquier clase de usuario que utilice este programa acepta someterse a los términos y integradas en este código fuente.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <a className="skip-link" href="#main-content">
            Saltar al contenido principal
          </a>
          <div className="app-shell">
            <div className="app-shell__content" id="main-content" tabIndex={-1}>
              {children}
            </div>
            <GlobalFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
