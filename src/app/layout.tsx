import type { Metadata } from 'next'
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
