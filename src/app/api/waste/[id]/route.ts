import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { WasteRecord } from '@/lib/types'

// PATCH /api/waste/[id] - Actualizar registro (ej: marcar como recolectado)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  const updateData: Partial<WasteRecord> = {}

  if (body.status === 'collected') {
    updateData.status = 'collected'
    updateData.collectedAt = new Date()
    if (body.collectorId) updateData.collectorId = new ObjectId(body.collectorId)
    if (body.txHash) updateData.txHash = body.txHash
  }

  const result = await db.collection<WasteRecord>('waste').findOneAndUpdate(
    { _id: new ObjectId(params.id) },
    { $set: updateData },
    { returnDocument: 'after' }
  )

  if (!result) {
    return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 })
  }

  return NextResponse.json(result)
}
