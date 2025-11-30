import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

/**
 * Convert full name to initials for privacy
 * Example: "Samuel Muñoz" -> "S.M."
 */
function getInitials(name: string): string {
  if (!name) return '?'
  
  const parts = name.trim().split(/\s+/)
  const initials = parts
    .map(part => part.charAt(0).toUpperCase())
    .join('.')
  
  return initials + '.'
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const leaderboard = await db.collection('transactions').aggregate([
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$pointsEarned' },
          totalKg: { $sum: '$amount' }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          fullName: '$user.name',
          points: '$totalPoints',
          recycled_kg: '$totalKg'
        }
      }
    ]).toArray()

    // Convert names to initials for privacy
    const anonymizedLeaderboard = leaderboard.map(entry => ({
      name: getInitials(entry.fullName),
      points: entry.points,
      recycled_kg: entry.recycled_kg
    }))

    return NextResponse.json({
      leaderboard: anonymizedLeaderboard
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
