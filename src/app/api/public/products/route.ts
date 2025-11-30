import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ProductType } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    
    const products = await db.collection<ProductType>('productTypes')
      .find({}, { projection: { name: 1, pricePerKg: 1, pointsPerKg: 1, _id: 0 } })
      .toArray()

    return NextResponse.json({
      products: products.map(p => ({
        name: p.name,
        points_per_kg: p.pointsPerKg || p.pricePerKg, // Fallback if schema varies
        description: `Recycle ${p.name} to earn ${p.pointsPerKg || p.pricePerKg} points per kg.`
      }))
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
