import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { PrivacySettings } from '@/lib/types'

// GET: Obtener consentimientos actuales del usuario
export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { db } = await connectToDatabase()
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(session.user.id) },
    { projection: { privacySettings: 1 } }
  )

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Valores por defecto si no tiene configurados
  const defaultSettings: PrivacySettings = {
    shareStats: false,
    shareHistory: false,
    shareLocation: false,
    allowRankings: true,
  }

  return NextResponse.json(user.privacySettings || defaultSettings)
}

// PUT: Actualizar consentimientos del usuario
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await request.json()
  
  // Validar que solo se actualicen campos permitidos
  const allowedFields = ['shareStats', 'shareHistory', 'shareLocation', 'allowRankings']
  const privacySettings: Record<string, boolean | Date> = {}
  
  for (const field of allowedFields) {
    if (typeof body[field] === 'boolean') {
      privacySettings[field] = body[field]
    }
  }
  
  // Añadir fecha de actualización
  privacySettings.updatedAt = new Date()

  const { db } = await connectToDatabase()
  
  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(session.user.id) },
    { $set: { privacySettings } }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ 
    message: 'Consentimientos actualizados',
    privacySettings 
  })
}
