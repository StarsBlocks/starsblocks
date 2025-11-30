'use client'

import { useEffect, useState } from 'react'
import { StarCategoryKey } from '@/lib/constants/starCategories'
import { AuthNav } from '@/components/AuthNav'

interface LeaderboardLocation {
  council?: string
  province?: string
  community?: string
  totalKg: number
}

interface CategoryLeaderboard {
  key: StarCategoryKey
  label: string
  color: string
  locations: LeaderboardLocation[]
}

export default function LeaderboardPage() {
  const [categories, setCategories] = useState<CategoryLeaderboard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadLeaderboard() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/leaderboard')
        if (!res.ok) {
          throw new Error('No se pudo cargar el leaderboard')
        }
        const data: CategoryLeaderboard[] = await res.json()
        if (isMounted) {
          setCategories(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error inesperado')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()
    return () => {
      isMounted = false
    }
  }, [])

  function locationLabel(location: LeaderboardLocation) {
    return location.council || location.province || location.community || 'Ubicación sin registrar'
  }

  function locationMeta(location: LeaderboardLocation) {
    if (location.council && (location.province || location.community)) {
      return `${location.province || ''}${location.province && location.community ? ' · ' : ''}${location.community || ''}`
    }
    if (location.province && location.community) {
      return `${location.province} · ${location.community}`
    }
    return location.community || location.province || ''
  }

  return (
    <>
      <AuthNav />
      <main className="leaderboard-shell" aria-live="polite">
        <section className="leaderboard-hero" aria-labelledby="leaderboard-title">
          <div>
            <p className="leaderboard-hero__eyebrow">Leaderboard</p>
            <h1 id="leaderboard-title">Ubicaciones más activas por material</h1>
            <p>
              Explorá qué ayuntamientos y comunidades lideran el reciclaje para cada categoría. Los datos se actualizan
              con cada recolección validada.
            </p>
          </div>
        </section>

        {loading && (
          <section className="dashboard-section" role="status" aria-live="assertive">
            <p>Cargando leaderboard...</p>
          </section>
        )}

        {error && !loading && (
          <section className="dashboard-section" role="alert">
            <p className="auth-error" aria-live="assertive">
              {error}
            </p>
          </section>
        )}

        {!loading && !error && (
          <section className="leaderboard-grid" aria-label="Ranking por categoría">
            {categories.map((category) => (
              <article key={category.key} className="leaderboard-card" aria-labelledby={`${category.key}-title`}>
                <header style={{ borderColor: category.color }}>
                  <div>
                    <span style={{ background: category.color }} />
                    <h2 id={`${category.key}-title`}>{category.label}</h2>
                  </div>
                  <p>{category.locations.length ? 'Top ubicaciones' : 'Sin registros'}</p>
                </header>
                {category.locations.length === 0 ? (
                  <p className="leaderboard-card__empty">Aún no hay registros para esta categoría.</p>
                ) : (
                  <ol>
                    {category.locations.map((location, index) => (
                      <li key={`${category.key}-${locationLabel(location)}-${index}`} aria-label={`Posición ${index + 1}`}>
                        <span className="leaderboard-position" aria-hidden="true">
                          #{index + 1}
                        </span>
                        <div>
                          <p>{locationLabel(location)}</p>
                          {locationMeta(location) && <small>{locationMeta(location)}</small>}
                        </div>
                        <strong>{location.totalKg.toFixed(1)} kg</strong>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  )
}
