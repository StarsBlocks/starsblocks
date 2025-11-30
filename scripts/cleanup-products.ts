import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

// Los 5 productos que queremos mantener (basados en la imagen)
const PRODUCTS_TO_KEEP = [
  { name: 'Vidrio', pricePerKg: 15, pointsPerKg: 15 },
  { name: 'Cartón', pricePerKg: 22, pointsPerKg: 22 },
  { name: 'Metal', pricePerKg: 34, pointsPerKg: 34 },
  { name: 'Aceite', pricePerKg: 21, pointsPerKg: 21 },
  { name: 'Envases', pricePerKg: 86, pointsPerKg: 86 },
]

async function cleanupProducts() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Conectado a MongoDB')

    const db = client.db('starsblocks')
    const collection = db.collection('productTypes')

    // Eliminar todos los productos existentes
    const deleteResult = await collection.deleteMany({})
    console.log(`Eliminados ${deleteResult.deletedCount} productos existentes`)

    // Insertar los 5 productos correctos
    const insertResult = await collection.insertMany(
      PRODUCTS_TO_KEEP.map(p => ({
        ...p,
        createdAt: new Date()
      }))
    )
    console.log(`Insertados ${insertResult.insertedCount} productos nuevos:`)
    PRODUCTS_TO_KEEP.forEach(p => console.log(`  - ${p.name}: ${p.pointsPerKg} pts/kg`))

    console.log('\nLimpieza completada!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

cleanupProducts()
