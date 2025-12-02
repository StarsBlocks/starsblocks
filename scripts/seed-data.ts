import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

// Nombres aleatorios para usuarios
const NOMBRES = [
  'María García', 'Juan Martínez', 'Ana López', 'Carlos Rodríguez', 'Laura Fernández',
  'Pedro Sánchez', 'Carmen Díaz', 'Miguel Hernández', 'Isabel Ruiz', 'Francisco Torres',
  'Lucía Moreno', 'Antonio Jiménez', 'Elena Romero', 'David Navarro', 'Paula Domínguez',
  'Javier Muñoz', 'Sara Álvarez', 'Alberto Castro', 'Marta Ortiz', 'Daniel Rubio'
]

// Ubicaciones de España
const UBICACIONES = [
  { ayuntamiento: 'Madrid', comunidad: 'Comunidad de Madrid', codigoPostal: '28001' },
  { ayuntamiento: 'Barcelona', comunidad: 'Cataluña', codigoPostal: '08001' },
  { ayuntamiento: 'Valencia', comunidad: 'Comunidad Valenciana', codigoPostal: '46001' },
  { ayuntamiento: 'Sevilla', comunidad: 'Andalucía', codigoPostal: '41001' },
  { ayuntamiento: 'Zaragoza', comunidad: 'Aragón', codigoPostal: '50001' },
  { ayuntamiento: 'Málaga', comunidad: 'Andalucía', codigoPostal: '29001' },
  { ayuntamiento: 'Murcia', comunidad: 'Región de Murcia', codigoPostal: '30001' },
  { ayuntamiento: 'Palma', comunidad: 'Islas Baleares', codigoPostal: '07001' },
  { ayuntamiento: 'Bilbao', comunidad: 'País Vasco', codigoPostal: '48001' },
  { ayuntamiento: 'Alicante', comunidad: 'Comunidad Valenciana', codigoPostal: '03001' },
]

// Genera una wallet aleatoria (simulada)
function generateWallet(): string {
  const chars = '0123456789abcdef'
  let wallet = '02' // Prefijo típico de public key comprimida
  for (let i = 0; i < 64; i++) {
    wallet += chars[Math.floor(Math.random() * chars.length)]
  }
  return wallet
}

// Genera una fecha aleatoria en los últimos N días
function randomDate(daysBack: number): Date {
  const now = new Date()
  const pastDate = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000)
  return pastDate
}

// Genera un hash de transacción simulado
function generateTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = ''
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

async function seedData() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Conectado a MongoDB')

    const db = client.db('starsblocks')

    // Obtener productos existentes
    const products = await db.collection('productTypes').find({}).toArray()
    if (products.length === 0) {
      console.error('No hay productos en la base de datos. Ejecuta cleanup-products.ts primero.')
      return
    }
    console.log(`Productos encontrados: ${products.map(p => p.name).join(', ')}`)

    // Obtener collectors existentes
    const collectors = await db.collection('collectors').find({}).toArray()
    if (collectors.length === 0) {
      console.error('No hay collectors en la base de datos. Crea al menos uno primero.')
      return
    }
    console.log(`Collectors encontrados: ${collectors.length}`)

    // Crear usuarios de prueba
    const usersToCreate = 50
    console.log(`\nCreando ${usersToCreate} usuarios de prueba...`)

    const users: any[] = []
    for (let i = 0; i < usersToCreate; i++) {
      const ubicacion = UBICACIONES[Math.floor(Math.random() * UBICACIONES.length)]
      const user = {
        email: `usuario${i + 1}@test.com`,
        password: '$2a$10$dummy.hash.for.testing.purposes.only', // Hash dummy
        name: NOMBRES[Math.floor(Math.random() * NOMBRES.length)] + ` ${i + 1}`,
        role: 'user',
        wallet: generateWallet(),
        ayuntamiento: ubicacion.ayuntamiento,
        comunidad: ubicacion.comunidad,
        codigoPostal: ubicacion.codigoPostal,
        privacySettings: {
          shareStats: Math.random() > 0.3,
          shareHistory: Math.random() > 0.5,
          shareLocation: Math.random() > 0.4,
          allowRankings: Math.random() > 0.2,
        },
        createdAt: randomDate(90), // Creado en los últimos 90 días
      }
      users.push(user)
    }

    const userResult = await db.collection('users').insertMany(users)
    console.log(`Insertados ${userResult.insertedCount} usuarios`)

    // Crear transacciones de prueba
    const transactionsToCreate = 200
    console.log(`\nCreando ${transactionsToCreate} transacciones de prueba...`)

    const insertedUserIds = Object.values(userResult.insertedIds)
    const transactions: any[] = []

    for (let i = 0; i < transactionsToCreate; i++) {
      const userId = insertedUserIds[Math.floor(Math.random() * insertedUserIds.length)]
      const collector = collectors[Math.floor(Math.random() * collectors.length)]
      const product = products[Math.floor(Math.random() * products.length)]
      const amount = Math.round((Math.random() * 50 + 1) * 10) / 10 // 0.1 a 50 kg
      const pointsEarned = amount * product.pointsPerKg

      const transaction = {
        userId: new ObjectId(userId),
        collectorId: new ObjectId(collector._id),
        productTypeId: new ObjectId(product._id),
        amount,
        pointsEarned,
        status: 'validated',
        txHash: generateTxHash(),
        createdAt: randomDate(60), // Últimos 60 días
        validatedAt: new Date(),
      }
      transactions.push(transaction)
    }

    const txResult = await db.collection('transactions').insertMany(transactions)
    console.log(`Insertadas ${txResult.insertedCount} transacciones`)

    // Resumen por ubicación
    console.log('\n=== RESUMEN POR UBICACIÓN ===')
    const usersByLocation = users.reduce((acc, user) => {
      const key = `${user.ayuntamiento}, ${user.comunidad}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const usersByLocationEntries = Object.entries(usersByLocation) as Array<[string, number]>
    usersByLocationEntries
      .sort((a, b) => b[1] - a[1])
      .forEach(([loc, count]) => {
        console.log(`  ${loc}: ${count} usuarios`)
      })

    // Resumen por material
    console.log('\n=== RESUMEN POR MATERIAL ===')
    const txByProduct = transactions.reduce((acc, tx) => {
      const product = products.find(p => p._id.toString() === tx.productTypeId.toString())
      if (product) {
        acc[product.name] = (acc[product.name] || 0) + tx.amount
      }
      return acc
    }, {} as Record<string, number>)

    const txByProductEntries = Object.entries(txByProduct) as Array<[string, number]>
    txByProductEntries
      .sort((a, b) => b[1] - a[1])
      .forEach(([material, kg]) => {
        console.log(`  ${material}: ${kg.toFixed(1)} kg`)
      })

    console.log('\n✅ Datos de prueba insertados correctamente!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

seedData()
