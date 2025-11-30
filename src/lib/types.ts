import { ObjectId } from 'mongodb'

// Usuario
export interface User {
  _id?: ObjectId
  wallet: string
  role: 'user' | 'collector'
  name: string
  createdAt: Date
}

// Registro de residuos heredado
export interface WasteRecord {
  _id?: ObjectId
  userId: ObjectId
  type: 'plastic' | 'glass' | 'organic' | 'metal' | 'paper' | 'electronic'
  amount: number // en kg
  status: 'pending' | 'collected'
  collectorId?: ObjectId
  txHash?: string // hash de la transacción blockchain
  createdAt: Date
  collectedAt?: Date
}

// Tipo de material reciclable
export interface ProductType {
  _id?: ObjectId
  name: string // plástico, vidrio, cartón...
  pricePerKg: number // precio por kg
  pointsPerKg: number // puntos que da por kg
  createdAt: Date
}

// Transacción de reciclaje
export interface Transaction {
  _id?: ObjectId
  userId: ObjectId // quién recicla
  collectorId: ObjectId // quién recolectó
  productTypeId: ObjectId // qué material
  amount: number // cantidad en kg
  pointsEarned: number // puntos ganados
  status: 'pending' | 'validated' | 'rejected'
  txHash?: string // hash blockchain (cuando se valide)
  createdAt: Date
  validatedAt?: Date
}
