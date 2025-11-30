'use client'

import { useMemo } from 'react'
import { RecyclingGraph } from '@/components/RecyclingGraph'
import { StarBlocksGame } from '@/components/StarBlocksGame'
import { PointsTracker } from '@/components/PointsTracker'
import { matchStarCategory, StarCategoryKey } from '@/lib/constants/starCategories'
import { useRecyclingHistory } from '@/hooks/useRecyclingHistory'

interface UserRecyclingExperienceProps {
  userId?: string
}

export function UserRecyclingExperience({ userId }: UserRecyclingExperienceProps) {
  const data = useRecyclingHistory({ userId })
  const { transactions, products, loading, error } = data

  const categoryTotals = useMemo(() => {
    const totals = Object.fromEntries(
      ['vidrio', 'papel', 'metal', 'aceite', 'envases'].map((key) => [key, 0])
    ) as Record<StarCategoryKey, number>

    transactions.forEach((transaction) => {
      const productName = products[transaction.productTypeId] || ''
      const category = matchStarCategory(productName)
      totals[category.key] += transaction.amount
    })

    return totals
  }, [transactions, products])

  const totalPoints = useMemo(() => {
    return Object.values(categoryTotals).reduce((sum, value) => sum + value, 0)
  }, [categoryTotals])

  const lastEntry = useMemo(() => {
    if (!transactions.length) return null
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return new Date(sorted[0].createdAt)
  }, [transactions])

  return (
    <>
      <StarBlocksGame
        categoryTotals={categoryTotals}
        totalPoints={totalPoints}
        loading={loading}
        error={error}
      />

      <PointsTracker categoryTotals={categoryTotals} totalPoints={totalPoints} lastEntry={lastEntry} />

      <RecyclingGraph role="user" userId={userId} prefetchedData={data} />
    </>
  )
}
