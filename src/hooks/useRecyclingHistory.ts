'use client'

import { useEffect, useState } from 'react'

export interface RecyclingHistoryTransaction {
  _id: string
  productTypeId: string
  amount: number
  createdAt: string
}

export interface RecyclingHistoryState {
  transactions: RecyclingHistoryTransaction[]
  products: Record<string, string>
  loading: boolean
  error: string | null
}

interface UseRecyclingHistoryParams {
  userId?: string
  collectorId?: string
  disabled?: boolean
  refreshKey?: string | number
}

export function useRecyclingHistory({
  userId,
  collectorId,
  disabled = false,
  refreshKey,
}: UseRecyclingHistoryParams): RecyclingHistoryState {
  const [transactions, setTransactions] = useState<RecyclingHistoryTransaction[]>([])
  const [products, setProducts] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const identifierReady = userId || collectorId
    if (!identifierReady || disabled) {
      if (!identifierReady) {
        setLoading(false)
      }
      return
    }

    async function loadData() {
      setLoading(true)
      setError(null)

      const queryParam = userId ? `userId=${userId}` : `collectorId=${collectorId}`

      try {
        const [txRes, productRes] = await Promise.all([
          fetch(`/api/transactions?${queryParam}`),
          fetch('/api/products'),
        ])

        if (!txRes.ok) {
          throw new Error('No se pudo obtener el historial de reciclaje')
        }
        if (!productRes.ok) {
          throw new Error('No se pudo cargar el catálogo de materiales')
        }

        const [txData, productData]: [RecyclingHistoryTransaction[], { _id: string; name: string }[]] =
          await Promise.all([txRes.json(), productRes.json()])

        const lookup = productData.reduce<Record<string, string>>((map, product) => {
          map[product._id] = product.name
          return map
        }, {})

        setTransactions(txData)
        setProducts(lookup)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error inesperado')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, collectorId, disabled, refreshKey])

  return { transactions, products, loading, error }
}
