import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/types'

// GET /api/users - Obtener todos los usuarios
export async function GET() {
  const { db } = await connectToDatabase()
  const users = await db.collection<User>('users').find().toArray()
  return NextResponse.json(users)
}

// POST /api/users - Crear usuario
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  const user: User = {
    wallet: body.wallet,
    email: body.email,
    name: body.name,
    role: body.role || 'user',
    createdAt: new Date(),
  }

  const result = await db.collection<User>('users').insertOne(user)
  return NextResponse.json({ ...user, _id: result.insertedId }, { status: 201 })
}
