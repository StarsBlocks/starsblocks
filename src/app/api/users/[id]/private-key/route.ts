import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/lib/types'

function decryptPrivateKey(encrypted: string, password: string): string {
  const [ivHex, encryptedHex] = encrypted.split(':')
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted payload')
  }

  const key = crypto.scryptSync(password, 'salt', 32)
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { password } = await request.json()

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 })
  }

  const { db } = await connectToDatabase()
  const user = await db.collection<User>('users').findOne({ _id: new ObjectId(id) })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  if (!user.password || !user.encryptedPrivateKey) {
    return NextResponse.json({ error: 'No hay llave privada disponible' }, { status: 400 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  try {
    const privateKey = decryptPrivateKey(user.encryptedPrivateKey, password)
    return NextResponse.json({ privateKey })
  } catch (error) {
    console.error('Error decrypting private key', error)
    return NextResponse.json({ error: 'No se pudo desencriptar la llave privada' }, { status: 500 })
  }
}
