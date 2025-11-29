import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/lib/types'

// PATCH /api/transactions/[id] - Actualizar transacción (si es necesario)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const updateData: Partial<Transaction> = {}

    if (body.status === 'rejected') {
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
  } catch (error: any) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ error: error.message || 'Error al actualizar transacción' }, { status: 500 })
  }
}
