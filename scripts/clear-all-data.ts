import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

async function clearAllData() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Conectado a MongoDB')

    const db = client.db('starsblocks')

    // Borrar usuarios
    const usersResult = await db.collection('users').deleteMany({})
    console.log(`Eliminados ${usersResult.deletedCount} usuarios`)

    // Borrar collectors
    const collectorsResult = await db.collection('collectors').deleteMany({})
    console.log(`Eliminados ${collectorsResult.deletedCount} collectors`)

    // Borrar transacciones
    const transactionsResult = await db.collection('transactions').deleteMany({})
    console.log(`Eliminados ${transactionsResult.deletedCount} transacciones`)

    console.log('\n✅ Todas las tablas han sido limpiadas!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

clearAllData()
