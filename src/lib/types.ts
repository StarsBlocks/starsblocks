import { ObjectId } from 'mongodb'

// Configuración de privacidad del usuario
export interface PrivacySettings {
  shareStats: boolean           // Compartir estadísticas (kg, tokens) con servicios externos
  shareHistory: boolean         // Compartir historial de transacciones
  shareLocation: boolean        // Compartir ubicación/ayuntamiento
  allowRankings: boolean        // Aparecer en rankings públicos
}

// Usuario reciclador
export interface User {
  _id?: ObjectId
  email: string
  password: string              // hash de la contraseña
  name: string
  dni?: string
  role: 'user'
  wallet?: string               // publicKey (sin encriptar)
  encryptedPrivateKey?: string  // privateKey encriptado con password del usuario
  // Campos de interoperabilidad
  ayuntamiento?: string         // Ayuntamiento del usuario
  comunidad?: string            // Comunidad Autónoma
  codigoPostal?: string         // Código postal
  // Consentimiento granular
  privacySettings?: PrivacySettings
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
  // Campos de interoperabilidad
  community: string         // Comunidad Autónoma donde opera
  province: string          // Provincia donde opera
  council: string           // Municipio/Ayuntamiento donde opera
  createdAt: Date
}

// Tipo de material reciclable
export interface ProductType {
  _id?: ObjectId
  name: string           // plástico, vidrio, cartón...
  pricePerKg: number     // precio por kg
  pointsPerKg: number    // puntos que da por kg
  createdAt: Date
}

// Transacción de reciclaje
export interface Transaction {
  _id?: ObjectId
  userId: ObjectId           // quién recicla
  collectorId: ObjectId      // quién recolectó
  productTypeId: ObjectId    // qué material
  amount: number             // cantidad en kg
  pointsEarned: number       // puntos ganados
  status: 'pending' | 'validated' | 'rejected'
  txHash?: string            // hash blockchain (cuando se valide)
  createdAt: Date
  validatedAt?: Date
}
