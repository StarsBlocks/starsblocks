import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/lib/types'

// PATCH /api/transactions/[id] - Validar o rechazar transacción
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  const updateData: Partial<Transaction> = {}

  if (body.status === 'validated') {
    updateData.status = 'validated'
    updateData.validatedAt = new Date()
    if (body.txHash) updateData.txHash = body.txHash
  } else if (body.status === 'rejected') {
    updateData.status = 'rejected'
  }

  const result = await db.collection<Transaction>('transactions').findOneAndUpdate(
    { _id: new ObjectId(params.id) },
    { $set: updateData },
    { returnDocument: 'after' }
  )

  if (!result) {
    return NextResponse.json({ error: 'Transacción no encontrada' }, { status: 404 })
  }

  return NextResponse.json(result)
}
