import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/types'

// Genera una wallet temporal (simulada) - se reemplazará con blockchain real
function generateTempWallet(): string {
  const randomBytes = crypto.randomBytes(20)
  return '0x' + randomBytes.toString('hex')
}

export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  // Verificar si el email ya existe
  const existingUser = await db.collection<User>('users').findOne({
    email: body.email,
  })

  if (existingUser) {
    return NextResponse.json(
      { error: 'El email ya está registrado' },
      { status: 400 }
    )
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(body.password, 10)

  // Generar wallet temporal
  const wallet = generateTempWallet()

  const user: User = {
    email: body.email,
    password: hashedPassword,
    name: body.name,
    dni: body.dni,
    role: 'user',
    wallet,
    createdAt: new Date(),
  }

  const result = await db.collection<User>('users').insertOne(user)

  // No devolver la contraseña
  const { password, ...userWithoutPassword } = user

  return NextResponse.json(
    { ...userWithoutPassword, _id: result.insertedId },
    { status: 201 }
  )
}
