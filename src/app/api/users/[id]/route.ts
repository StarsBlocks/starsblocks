import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { User, Transaction } from '@/lib/types'

// Genera wallet temporal si no existe
function generateTempWallet(): string {
  const randomBytes = crypto.randomBytes(20)
  return '0x' + randomBytes.toString('hex')
}

// GET /api/users/[id] - Obtener usuario por ID con estadísticas
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { db } = await connectToDatabase()

  const user = await db.collection<User>('users').findOne({
    _id: new ObjectId(id)
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Si el usuario no tiene wallet, generarle una (migración para usuarios existentes)
  let wallet = user.wallet
  if (!wallet) {
    wallet = generateTempWallet()
    await db.collection<User>('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { wallet } }
    )
  }

  // Obtener estadísticas de transacciones
  const transactions = await db.collection<Transaction>('transactions')
    .find({ userId: new ObjectId(id) })
    .toArray()

  const totalKg = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalPoints = transactions.reduce((sum, t) => sum + t.pointsEarned, 0)
  const totalTransactions = transactions.length

  return NextResponse.json({
    wallet,
    totalKg,
    totalPoints,
    totalTransactions,
  })
}
