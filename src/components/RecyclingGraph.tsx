'use client'

import { useMemo } from 'react'
import { RecyclingHistoryState, useRecyclingHistory } from '@/hooks/useRecyclingHistory'
import { matchStarCategory, starCategories, StarCategoryKey } from '@/lib/constants/starCategories'

type Role = 'user' | 'collector'

interface RecyclingGraphProps {
  role: Role
  userId?: string
  collectorId?: string
  prefetchedData?: RecyclingHistoryState
  refreshKey?: string | number
}

interface Bucket {
  monthKey: string
  label: string
  categories: Record<StarCategoryKey, number>
}

const MAX_TIMELINE_CUBES = 48

function formatMonthKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}`
}

function readableMonth(key: string) {
  const [year, month] = key.split('-').map(Number)
  const date = new Date(year, (month || 1) - 1, 1)
  return date.toLocaleString('es-ES', { month: 'short', year: '2-digit' })
}

export function RecyclingGraph({
  role,
  userId,
  collectorId,
  prefetchedData,
  refreshKey,
}: RecyclingGraphProps) {
  const identifierReady = role === 'user' ? Boolean(userId) : Boolean(collectorId)

  const fallbackData = useRecyclingHistory({
    userId: role === 'user' ? userId : undefined,
    collectorId: role === 'collector' ? collectorId : undefined,
    disabled: Boolean(prefetchedData),
    refreshKey,
  })

  const { transactions, products, loading, error } = prefetchedData ?? fallbackData

  const createEmptyCategoryTotals = () =>
    starCategories.reduce((acc, category) => {
      acc[category.key] = 0
      return acc
    }, {} as Record<StarCategoryKey, number>)

  const buckets = useMemo<Bucket[]>(() => {
    if (!transactions.length) return []
    const bucketMap = new Map<string, Record<StarCategoryKey, number>>()

    transactions.forEach((tx) => {
      const productName = products[tx.productTypeId] || ''
      const category = matchStarCategory(productName)
      const monthKey = formatMonthKey(new Date(tx.createdAt))
      const monthEntry = bucketMap.get(monthKey) || createEmptyCategoryTotals()
      monthEntry[category.key] += tx.amount
      bucketMap.set(monthKey, monthEntry)
    })

    return Array.from(bucketMap.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([monthKey, categories]) => ({
        monthKey,
        label: readableMonth(monthKey),
        categories,
      }))
  }, [transactions, products])

  const categoryTotals = useMemo(() => {
    const totals = createEmptyCategoryTotals()
    transactions.forEach((tx) => {
      const productName = products[tx.productTypeId] || ''
      const category = matchStarCategory(productName)
      totals[category.key] += tx.amount
    })
    return totals
  }, [transactions, products])

  const maxKg = useMemo(() => {
    return Math.max(
      1,
      ...buckets.map((bucket) =>
        Object.values(bucket.categories).reduce((sum, value) => sum + value, 0)
      )
    )
  }, [buckets])

  const totalKg = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0)
  }, [transactions])

  const timelineEntries = useMemo(() => {
    if (!transactions.length) return []
    return [...transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((tx) => {
        const productName = products[tx.productTypeId] || ''
        const category = matchStarCategory(productName)
        const date = new Date(tx.createdAt)
        return {
          id: tx._id,
          amount: tx.amount,
          category,
          isoDate: date.toISOString(),
          dateLabel: date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }
      })
  }, [transactions, products])

  const isCollector = role === 'collector'
  const viewBoxWidth = 640
  const viewBoxHeight = 280
  const chartPadding = 36

  if (!identifierReady) {
    return null
  }

  return (
    <section className="dashboard-section recycling-graph">
      <header className="recycling-graph__head">
        <div>
          <p className="recycling-graph__eyebrow">
            {isCollector ? 'Verificación de recolecciones' : 'Histórico de reciclaje'}
          </p>
          <h3>
            {isCollector
              ? 'Suma de residuos confirmados por tus registros'
              : 'Kilos reciclados por categoría'}
          </h3>
        </div>
        <div className="recycling-graph__summary">
          <span>Total</span>
          <strong>{totalKg.toFixed(1)} kg</strong>
        </div>
      </header>
      {loading && (
        <div className="recycling-graph__loading">
          <span />
          <p>Calculando métricas...</p>
        </div>
      )}

      {!loading && error && <p className="auth-error">{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p className="recycling-graph__empty">
          Aún no tenemos registros para graficar. Registra una recolección para ver actividad.
        </p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <>
          <div className="recycling-graph__chart">
            <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} role="img" aria-label="Gráfico de kg reciclados por categoría">
              <defs>
                <linearGradient id="graphGrid" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
                </linearGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width={viewBoxWidth}
                height={viewBoxHeight}
                fill="url(#graphGrid)"
                opacity="0.12"
              />

              {[0.25, 0.5, 0.75, 1].map((fraction) => {
                const y =
                  chartPadding + (1 - fraction) * (viewBoxHeight - chartPadding * 2)
                return (
                  <line
                    key={fraction}
                    x1={chartPadding}
                    x2={viewBoxWidth - chartPadding}
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={1}
                  />
                )
              })}

              {starCategories.map((category) => {
                const points = buckets.map((bucket, index) => {
                  const value = bucket.categories[category.key] || 0
                  const normalizedValue = value / maxKg
                  const xRange = viewBoxWidth - chartPadding * 2
                  const yRange = viewBoxHeight - chartPadding * 2
                  const x =
                    buckets.length === 1
                      ? viewBoxWidth / 2
                      : chartPadding + (xRange * index) / (buckets.length - 1)
                  const y = chartPadding + yRange * (1 - normalizedValue)
                  return `${x},${y}`
                })

                return (
                  <polyline
                    key={category.key}
                    fill="none"
                    stroke={category.colorVar}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.join(' ')}
                  />
                )
              })}

              {buckets.map((bucket, index) => {
                const xRange = viewBoxWidth - chartPadding * 2
                const x =
                  buckets.length === 1
                    ? viewBoxWidth / 2
                    : chartPadding + (xRange * index) / (buckets.length - 1)
                return (
                  <text
                    key={bucket.monthKey}
                    x={x}
                    y={viewBoxHeight - chartPadding / 2}
                    fill="rgba(248,250,252,0.65)"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {bucket.label}
                  </text>
                )
              })}
            </svg>
          </div>

          <div className="recycling-graph__legend">
            {starCategories.map((category) => (
              <div key={category.key} className="recycling-graph__legend-item">
                <span
                  className="recycling-graph__legend-swatch"
                  style={{ background: category.colorVar }}
                />
                <div>
                  <p>{category.label}</p>
                  <small>{(categoryTotals[category.key] || 0).toFixed(1)} kg</small>
                </div>
              </div>
            ))}
          </div>

          {timelineEntries.length > 0 && (
            <div className="recycling-graph__timeline">
              <p className="recycling-graph__timeline-title">
                {isCollector ? 'Cronología de recolecciones' : 'Cronología de bloques registrados'}
              </p>
              <div className="recycling-graph__timeline-list">
                {timelineEntries.map((entry) => {
                  const totalUnits = Math.max(1, Math.round(entry.amount))
                  const cubesToRender = Math.min(totalUnits, MAX_TIMELINE_CUBES)
                  const overflow = Math.max(0, totalUnits - MAX_TIMELINE_CUBES)

                  return (
                    <article key={entry.id} className="recycling-graph__timeline-item">
                      <div className="recycling-graph__timeline-meta">
                        <time dateTime={entry.isoDate}>{entry.dateLabel}</time>
                        <span>{entry.category.label}</span>
                        <strong>{entry.amount.toFixed(1)} kg</strong>
                      </div>
                      <div
                        className="recycling-graph__cubes"
                        aria-label={`Bloques de ${entry.category.label} (${entry.amount.toFixed(1)} kg)`}
                      >
                        {Array.from({ length: cubesToRender }).map((_, cubeIndex) => (
                          <span
                            key={`${entry.id}-${cubeIndex}`}
                            className="recycling-graph__cube"
                            style={{ background: entry.category.colorVar }}
                          />
                        ))}
                        {overflow > 0 && (
                          <span className="recycling-graph__cube-more">{overflow} bloques</span>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
