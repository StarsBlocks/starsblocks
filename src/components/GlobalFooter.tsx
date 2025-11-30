'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from './SiteFooter'

export function GlobalFooter() {
  const pathname = usePathname()
  if (pathname === '/') {
    return null
  }

  return <SiteFooter />
}
