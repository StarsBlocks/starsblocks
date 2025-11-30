import type { Metadata } from 'next'
import './globals.css'
import { GlobalFooter } from '@/components/GlobalFooter'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'StarBlocks',
  description: 'Convierte tu reciclaje en bloques digitales y compite por el primer puesto.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: ['/logo.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="app-shell">
            <div className="app-shell__content">{children}</div>
            <GlobalFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
