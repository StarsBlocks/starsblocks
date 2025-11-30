'use client'

import { ReactNode } from 'react'
import { AuthNav } from '@/components/AuthNav'

type LegalPageLayoutProps = {
  title: string
  children: ReactNode
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <>
      <AuthNav />
      <main className="legal-page">
        <section className="legal-content">
          <h1>{title}</h1>
          <div className="legal-scroll">
            {children}
          </div>
        </section>
      </main>
    </>
  )
}
