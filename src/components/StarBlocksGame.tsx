'use client'

import { useMemo } from 'react'
import { starCategories, StarCategoryKey } from '@/lib/constants/starCategories'

interface StarBlocksGameProps {
  categoryTotals: Record<StarCategoryKey, number>
  totalPoints: number
  loading: boolean
  error: string | null
}

export function StarBlocksGame({ categoryTotals, totalPoints, loading, error }: StarBlocksGameProps) {
  const categoryState = useMemo(
    () =>
      starCategories.map((category, index) => {
        const total = categoryTotals[category.key] || 0
        return {
          ...category,
          total,
          blocks: Math.floor(total),
          active: total > 0,
          delay: index * 0.35,
        }
      }),
    [categoryTotals]
  )

  const activeCategories = categoryState.filter((category) => category.active).length
  const completedStar = activeCategories === starCategories.length
  const blockCount = Math.floor(totalPoints)

  return (
    <section className="dashboard-section star-progress">
      <header className="star-progress__head">
        <div>
          <p className="star-progress__eyebrow">Juego de bloques</p>
          <h3>Cada material suma un punto en la estrella</h3>
        </div>
        <div className="star-progress__summary">
          <span>Total de bloques</span>
          <strong>{blockCount}</strong>
          <small>{activeCategories} / {starCategories.length} materiales activos</small>
        </div>
      </header>

      {loading && (
        <div className="star-game__loading">
          <span />
          <p>Preparando tu estrella...</p>
        </div>
      )}

      {!loading && error && <p className="auth-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className={`star-lab star-lab--dashboard ${completedStar ? 'star-lab--complete' : ''}`}>
            <div className="star-assembly" role="img" aria-label="Estado de la estrella de reciclaje">
              <div className="star-outline" />
              {categoryState.map((category) => (
              <span
                key={category.key}
                className={`star-block star-block--${category.key} ${
                  category.active ? 'star-block--active' : 'star-block--inactive'
                }`}
                aria-label={`${category.label}: ${category.blocks} bloques`}
                role="img"
                style={{ animationDelay: `${category.delay}s` }}
              />
            ))}
            </div>
            <p className="star-progress__note">En el futuro te verás recompensado.</p>
          </div>

          <ul className="star-progress__legend" aria-label="Bloques por categoría">
            {categoryState.map((category) => (
              <li key={category.key}>
                <span style={{ background: category.colorVar }} />
                <div>
                  <p>{category.label}</p>
                  <small>{category.blocks} bloques</small>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
