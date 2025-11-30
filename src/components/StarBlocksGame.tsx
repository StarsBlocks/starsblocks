'use client'

import { useMemo } from 'react'
import { starCategories, StarCategoryKey } from '@/lib/constants/starCategories'

interface StarBlocksGameProps {
  categoryTotals: Record<StarCategoryKey, number>
  totalPoints: number
  loading: boolean
  error: string | null
}

const MAX_BLOCKS = 80

export function StarBlocksGame({ categoryTotals, totalPoints, loading, error }: StarBlocksGameProps) {
  const blocks = useMemo(() => {
    const entries: { key: StarCategoryKey; color: string }[] = []

    starCategories.forEach((category) => {
      const total = Math.floor(categoryTotals[category.key] || 0)
      const count = Math.min(total, MAX_BLOCKS / starCategories.length)

      for (let index = 0; index < count; index += 1) {
        entries.push({ key: category.key, color: category.colorVar })
      }
    })

    return entries.slice(0, MAX_BLOCKS)
  }, [categoryTotals])

  const completedPercentage = Math.min(1, totalPoints / MAX_BLOCKS)

  return (
    <section className="dashboard-section star-game">
      <header className="star-game__head">
        <div>
          <p className="star-game__eyebrow">Juego de bloques</p>
          <h3>Llena la estrella con cada kilo registrado</h3>
        </div>
        <div className="star-game__progress">
          <span>{Math.floor(totalPoints)} bloques</span>
          <small>Meta actual: {MAX_BLOCKS}</small>
          <div className="star-game__progress-bar" aria-label="Progreso de bloques">
            <div style={{ width: `${completedPercentage * 100}%` }} />
          </div>
        </div>
      </header>

      {loading && (
        <div className="star-game__loading">
          <span />
          <p>Preparando tu estrella...</p>
        </div>
      )}

      {!loading && error && <p className="auth-error">{error}</p>}

      {!loading && !error && totalPoints === 0 && (
        <p className="star-game__empty">
          Aún no hay bloques activos. Registra tu primera recolección para encender la estrella.
        </p>
      )}

      {!loading && !error && totalPoints > 0 && (
        <div className="star-game__container">
          <div className="star-game__star" role="img" aria-label="Bloques activos de la estrella">
            {blocks.map((block, index) => (
              <span
                key={`${block.key}-${index}`}
                className={`star-game__block star-game__block--${block.key}`}
                style={{ background: block.color }}
              />
            ))}
          </div>

          <ul className="star-game__legend">
            {starCategories.map((category) => {
              const count = Math.floor(categoryTotals[category.key] || 0)
              return (
                <li key={category.key}>
                  <span style={{ background: category.colorVar }} />
                  <div>
                    <p>{category.label}</p>
                    <small>{count} bloques</small>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
