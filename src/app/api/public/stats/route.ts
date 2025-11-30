import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const stats = await db.collection<Transaction>('transactions').aggregate([
      {
        $group: {
          _id: null,
          totalKg: { $sum: '$amount' },
          totalPoints: { $sum: '$pointsEarned' },
          totalTransactions: { $count: {} }
        }
      }
    ]).toArray()

    const result = stats[0] || { totalKg: 0, totalPoints: 0, totalTransactions: 0 }

    return NextResponse.json({
      total_recycled_kg: result.totalKg,
      total_points_issued: result.totalPoints || 0,
      total_transactions: result.totalTransactions,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
