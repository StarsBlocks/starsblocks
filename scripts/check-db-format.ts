import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

async function checkDbFormat() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Conectado a MongoDB\n')

    const db = client.db('starsblocks')

    // Usuarios
    console.log('=== USUARIOS ===')
    const users = await db.collection('users').find({}).toArray()
    console.log(`Total: ${users.length}`)
    if (users.length > 0) {
      console.log('Ejemplo:')
      console.log(JSON.stringify(users[0], null, 2))
    }

    // Collectors
    console.log('\n=== COLLECTORS ===')
    const collectors = await db.collection('collectors').find({}).toArray()
    console.log(`Total: ${collectors.length}`)
    if (collectors.length > 0) {
      console.log('Ejemplo:')
      console.log(JSON.stringify(collectors[0], null, 2))
    }

    // Transacciones
    console.log('\n=== TRANSACCIONES ===')
    const transactions = await db.collection('transactions').find({}).limit(1).toArray()
    console.log(`Total: ${await db.collection('transactions').countDocuments()}`)
    if (transactions.length > 0) {
      console.log('Ejemplo:')
      console.log(JSON.stringify(transactions[0], null, 2))
    }

    // ProductTypes
    console.log('\n=== PRODUCT TYPES ===')
    const products = await db.collection('productTypes').find({}).toArray()
    console.log(`Total: ${products.length}`)
    products.forEach(p => console.log(`  - ${p.name}: ${p.pointsPerKg} pts/kg (ID: ${p._id})`))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

checkDbFormat()
