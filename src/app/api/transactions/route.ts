import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { Transaction, ProductType, User } from '@/lib/types'
import { registerWasteOnChain } from '@/lib/blockchain'

// GET /api/transactions - Lista transacciones
export async function GET(request: NextRequest) {
  const { db } = await connectToDatabase()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const collectorId = searchParams.get('collectorId')
  const status = searchParams.get('status')

  const filter: Record<string, unknown> = {}
  if (userId) filter.userId = new ObjectId(userId)
  if (collectorId) filter.collectorId = new ObjectId(collectorId)
  if (status) filter.status = status

  const transactions = await db.collection<Transaction>('transactions').find(filter).toArray()
  return NextResponse.json(transactions)
}

// POST /api/transactions - Crear transacción de reciclaje
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  // Buscar usuario por wallet (publicAddress del NFC)
  const user = await db.collection<User>('users').findOne({
    wallet: body.userWallet
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado con esa wallet' }, { status: 404 })
  }

  // Obtener el tipo de producto para calcular puntos
  const productType = await db.collection<ProductType>('productTypes').findOne({
    _id: new ObjectId(body.productTypeId)
  })

  if (!productType) {
    return NextResponse.json({ error: 'Tipo de producto no encontrado' }, { status: 404 })
  }

  const pointsEarned = body.amount * productType.pointsPerKg

  // Registrar en blockchain
  const txHash = await registerWasteOnChain({
    user: user.wallet || '',
    collector_id: body.collectorId,
    product_type: productType.name,
    amount: body.amount,
    points: pointsEarned
  })

  const transaction: Transaction = {
    userId: user._id!,
    collectorId: new ObjectId(body.collectorId),
    productTypeId: new ObjectId(body.productTypeId),
    amount: body.amount,
    pointsEarned,
    status: 'validated',
    txHash,
    createdAt: new Date(),
    validatedAt: new Date(),
  }

  const result = await db.collection<Transaction>('transactions').insertOne(transaction)
  return NextResponse.json({
    ...transaction,
    _id: result.insertedId,
    userName: user.name,
    productName: productType.name,
    txHash,
  }, { status: 201 })
}
