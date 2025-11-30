import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { starCategories, matchStarCategory, StarCategoryKey } from '@/lib/constants/starCategories'

interface LeaderboardLocation {
  council?: string
  province?: string
  community?: string
  totalKg: number
}

type CategoryBucket = Map<string, LeaderboardLocation>

export async function GET() {
  const { db } = await connectToDatabase()

  const pipeline = [
    {
      $lookup: {
        from: 'collectors',
        localField: 'collectorId',
        foreignField: '_id',
        as: 'collector',
      },
    },
    { $unwind: '$collector' },
    {
      $lookup: {
        from: 'productTypes',
        localField: 'productTypeId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        amount: 1,
        productName: '$product.name',
        council: '$collector.council',
        province: '$collector.province',
        community: '$collector.community',
      },
    },
  ]

  const rows = await db.collection('transactions').aggregate(pipeline).toArray()

  const categoryBuckets = starCategories.reduce<Record<StarCategoryKey, CategoryBucket>>((map, cat) => {
    map[cat.key] = new Map()
    return map
  }, {} as Record<StarCategoryKey, CategoryBucket>)

  rows.forEach((row: { amount: number; productName: string; council?: string; province?: string; community?: string }) => {
    const category = matchStarCategory(row.productName)
    const bucket = categoryBuckets[category.key]
    const locationKey = `${row.council || ''}|${row.province || ''}|${row.community || ''}`
    const entry = bucket.get(locationKey) || {
      council: row.council,
      province: row.province,
      community: row.community,
      totalKg: 0,
    }
    entry.totalKg += Number(row.amount) || 0
    bucket.set(locationKey, entry)
  })

  const payload = starCategories.map((category) => ({
    key: category.key,
    label: category.label,
    color: category.colorVar,
    locations: Array.from(categoryBuckets[category.key].values())
      .sort((a, b) => b.totalKg - a.totalKg)
      .slice(0, 5),
  }))

  return NextResponse.json(payload)
}
