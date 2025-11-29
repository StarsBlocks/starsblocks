import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/types'
import { createWallet } from '@/lib/blockchain'

// Encriptar privateKey con la password del usuario
function encryptPrivateKey(privateKey: string, password: string): string {
  const algorithm = 'aes-256-cbc'
  // Derivar una key de 32 bytes desde la password
  const key = crypto.scryptSync(password, 'salt', 32)
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(privateKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Retornar iv + encrypted (necesitamos el iv para desencriptar)
  return iv.toString('hex') + ':' + encrypted
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

  // Crear wallet en blockchain
  const walletData = await createWallet()

  // Encriptar privateKey con la password del usuario (antes de hashear)
  const encryptedPrivateKey = encryptPrivateKey(walletData.privateKey, body.password)

  // Debug logs
  console.log('=== REGISTRO USUARIO ===')
  console.log('Public Key:', walletData.publicKey)
  console.log('Private Key (original):', walletData.privateKey)
  console.log('Private Key (encrypted):', encryptedPrivateKey)
  console.log('Address:', walletData.address)
  console.log('========================')

  const user: User = {
    email: body.email,
    password: hashedPassword,
    name: body.name,
    dni: body.dni,
    role: 'user',
    wallet: walletData.publicKey,        // publicKey sin encriptar
    encryptedPrivateKey: encryptedPrivateKey, // privateKey encriptado
    createdAt: new Date(),
  }

  const result = await db.collection<User>('users').insertOne(user)

  // No devolver la contraseña ni la privateKey encriptada
  const { password, encryptedPrivateKey: _, ...userWithoutSensitive } = user

  return NextResponse.json(
    { ...userWithoutSensitive, _id: result.insertedId },
    { status: 201 }
  )
}
