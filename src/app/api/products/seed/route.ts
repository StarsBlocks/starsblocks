import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ProductType } from '@/lib/types'

// GET /api/products/seed - Crear productos iniciales
export async function GET() {
  const { db } = await connectToDatabase()

  // Verificar si ya hay productos
  const count = await db.collection<ProductType>('productTypes').countDocuments()
  if (count > 0) {
    return NextResponse.json({ message: 'Ya existen productos', count })
  }

  // Precios aproximados del mercado de reciclaje (USD/kg) - 2024
  // Tokens = precio * 10 (redondeado)
  const products: Omit<ProductType, '_id'>[] = [
    { name: 'PET (Botellas plástico)', pricePerKg: 0.35, tokensPerKg: 4, createdAt: new Date() },
    { name: 'HDPE (Plástico duro)', pricePerKg: 0.45, tokensPerKg: 5, createdAt: new Date() },
    { name: 'Aluminio (Latas)', pricePerKg: 1.20, tokensPerKg: 12, createdAt: new Date() },
    { name: 'Cobre', pricePerKg: 6.50, tokensPerKg: 65, createdAt: new Date() },
    { name: 'Chatarra Hierro', pricePerKg: 0.25, tokensPerKg: 3, createdAt: new Date() },
    { name: 'Cartón', pricePerKg: 0.08, tokensPerKg: 1, createdAt: new Date() },
    { name: 'Papel Blanco', pricePerKg: 0.12, tokensPerKg: 1, createdAt: new Date() },
    { name: 'Vidrio', pricePerKg: 0.05, tokensPerKg: 1, createdAt: new Date() },
    { name: 'E-Waste (Electrónicos)', pricePerKg: 2.00, tokensPerKg: 20, createdAt: new Date() },
    { name: 'Baterías', pricePerKg: 1.50, tokensPerKg: 15, createdAt: new Date() },
    { name: 'Aceite Usado (litro)', pricePerKg: 0.30, tokensPerKg: 3, createdAt: new Date() },
  ]

  await db.collection<ProductType>('productTypes').insertMany(products)

  return NextResponse.json({ message: 'Productos creados', products })
}
