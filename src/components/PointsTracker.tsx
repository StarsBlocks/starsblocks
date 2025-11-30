'use client'

import { useMemo } from 'react'
import { starCategories, StarCategoryKey } from '@/lib/constants/starCategories'

interface PointsTrackerProps {
  categoryTotals: Record<StarCategoryKey, number>
  totalPoints: number
  lastEntry?: Date | null
}

export function PointsTracker({ categoryTotals, totalPoints, lastEntry }: PointsTrackerProps) {
  const level = Math.floor(totalPoints / 25)
  const nextMilestone = Math.max(25, Math.ceil((totalPoints + 1) / 25) * 25)
  const progressToMilestone = Math.min(1, totalPoints / nextMilestone)

  const leaderboard = useMemo(() => {
    return [...starCategories]
      .map((category) => ({
        ...category,
        points: categoryTotals[category.key] || 0,
      }))
      .sort((a, b) => b.points - a.points)
  }, [categoryTotals])

  const leader = leaderboard[0]
  const lastEntryText = lastEntry
    ? lastEntry.toLocaleString('es-ES', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Sin actividad reciente'

  return (
    <section className="dashboard-section points-tracker">
      <header className="points-tracker__head">
        <div>
          <p className="points-tracker__eyebrow">Marcador</p>
          <h3>
            Nivel {level} · Próxima meta {nextMilestone} pts
          </h3>
        </div>
        <div className="points-tracker__total">
          <span>Total acumulado</span>
          <strong>{totalPoints.toFixed(1)} pts</strong>
        </div>
      </header>

      <div className="points-tracker__milestone">
        <div className="points-tracker__milestone-bar" aria-label="Progreso hacia la meta">
          <div style={{ width: `${progressToMilestone * 100}%` }} />
        </div>
        <small>Última actividad: {lastEntryText}</small>
      </div>

      <div className="points-tracker__leaderboard">
        {leaderboard.map((category) => {
          const percentage = leader?.points ? (category.points / leader.points) * 100 : 0
          return (
            <article key={category.key}>
              <header>
                <span style={{ background: category.colorVar }} />
                <p>{category.label}</p>
                {leader?.key === category.key && <small>Lidera</small>}
              </header>
              <div className="points-tracker__leaderboard-bar">
                <div style={{ width: `${percentage}%`, background: category.colorVar }} />
              </div>
              <p className="points-tracker__leaderboard-points">{category.points.toFixed(1)} pts</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
