import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { Collector } from '@/lib/types'

// GET /api/collectors - Lista recolectores
export async function GET() {
  const { db } = await connectToDatabase()
  const collectors = await db.collection<Collector>('collectors').find().toArray()

  // No devolver passwords
  const safeCollectors = collectors.map(({ password, ...rest }) => rest)
  return NextResponse.json(safeCollectors)
}

// POST /api/collectors - Registrar recolector
export async function POST(request: NextRequest) {
  const { db } = await connectToDatabase()
  const body = await request.json()

  // Verificar si el email ya existe
  const existingCollector = await db.collection<Collector>('collectors').findOne({
    email: body.email,
  })

  if (existingCollector) {
    return NextResponse.json(
      { error: 'El email ya está registrado' },
      { status: 400 }
    )
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(body.password, 10)

  const collector: Collector = {
    email: body.email,
    password: hashedPassword,
    name: body.name,
    dni: body.dni,
    role: 'collector',
    company: body.company,
    zone: body.zone,
    vehicle: body.vehicle,
    license: body.license,
    community: body.community,
    province: body.province,
    council: body.council,
    createdAt: new Date(),
  }

  const result = await db.collection<Collector>('collectors').insertOne(collector)

  // No devolver la contraseña
  const { password, ...collectorWithoutPassword } = collector

  return NextResponse.json(
    { ...collectorWithoutPassword, _id: result.insertedId },
    { status: 201 }
  )
}
