import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  wallet: string
  role: 'user' | 'collector'
  name: string
  createdAt: Date
}

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
