import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { Transaction, ProductType } from '@/lib/types'

// GET /api/transactions - Lista transacciones
export async function GET(request: NextRequest) {
  const { db } = await connectToDatabase()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  const filter: Record<string, unknown> = {}
  if (userId) filter.userId = new ObjectId(userId)
  if (status) filter.status = status

  const transactions = await db.collection<Transaction>('transactions').find(filter).toArray()
  return NextResponse.json(transactions)
}

// POST /api/transactions - Crear transacción de reciclaje
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  // Obtener el tipo de producto para calcular tokens
  const productType = await db.collection<ProductType>('productTypes').findOne({
    _id: new ObjectId(body.productTypeId)
  })

  if (!productType) {
    return NextResponse.json({ error: 'Tipo de producto no encontrado' }, { status: 404 })
  }

  const tokensEarned = body.amount * productType.tokensPerKg

  const transaction: Transaction = {
    userId: new ObjectId(body.userId),
    productTypeId: new ObjectId(body.productTypeId),
    amount: body.amount,
    tokensEarned,
    status: 'pending',
    createdAt: new Date(),
  }

  const result = await db.collection<Transaction>('transactions').insertOne(transaction)
  return NextResponse.json({ ...transaction, _id: result.insertedId }, { status: 201 })
}
