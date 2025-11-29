import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { WasteRecord } from '@/lib/types'

// GET /api/waste - Obtener registros de basura
export async function GET(request: NextRequest) {
  const { db } = await connectToDatabase()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  const filter: Record<string, unknown> = {}
  if (userId) filter.userId = new ObjectId(userId)
  if (status) filter.status = status

  const records = await db.collection<WasteRecord>('waste').find(filter).toArray()
  return NextResponse.json(records)
}

// POST /api/waste - Registrar basura
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  const record: WasteRecord = {
    userId: new ObjectId(body.userId),
    type: body.type,
    amount: body.amount,
    status: 'pending',
    createdAt: new Date(),
  }

  const result = await db.collection<WasteRecord>('waste').insertOne(record)
  return NextResponse.json({ ...record, _id: result.insertedId }, { status: 201 })
}
