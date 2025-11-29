import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ProductType } from '@/lib/types'

// GET /api/products - Lista tipos de productos
export async function GET() {
  const { db } = await connectToDatabase()
  const products = await db.collection<ProductType>('productTypes').find().toArray()
  return NextResponse.json(products)
}

// POST /api/products - Crear tipo de producto
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  const product: ProductType = {
    name: body.name,
    pricePerKg: body.pricePerKg,
    tokensPerKg: body.tokensPerKg,
    createdAt: new Date(),
  }

  const result = await db.collection<ProductType>('productTypes').insertOne(product)
  return NextResponse.json({ ...product, _id: result.insertedId }, { status: 201 })
}
