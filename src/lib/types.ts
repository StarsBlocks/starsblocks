import { ObjectId } from 'mongodb'

// Usuario reciclador
export interface User {
  _id?: ObjectId
  email: string
  password: string          // hash de la contraseña
  name: string
  dni?: string
  role: 'user'
  wallet?: string           // se añade después con blockchain
  createdAt: Date
}

// Recolector
export interface Collector {
  _id?: ObjectId
  email: string
  password: string          // hash de la contraseña
  name: string
  dni?: string
  role: 'collector'
  company: string           // empresa a la que pertenece
  zone: string              // zona de recolección
  vehicle?: string          // vehículo asignado (placa)
  license?: string          // licencia/permisos
  wallet?: string           // se añade después con blockchain
  createdAt: Date
}

// Tipo de material reciclable
export interface ProductType {
  _id?: ObjectId
  name: string           // plástico, vidrio, cartón...
  pricePerKg: number     // precio por kg
  tokensPerKg: number    // tokens que da por kg
  createdAt: Date
}

// Transacción de reciclaje
export interface Transaction {
  _id?: ObjectId
  userId: ObjectId           // quién recicla
  collectorId: ObjectId      // quién recolectó
  productTypeId: ObjectId    // qué material
  amount: number             // cantidad en kg
  tokensEarned: number       // tokens ganados
  status: 'pending' | 'validated' | 'rejected'
  txHash?: string            // hash blockchain (cuando se valide)
  createdAt: Date
  validatedAt?: Date
}
