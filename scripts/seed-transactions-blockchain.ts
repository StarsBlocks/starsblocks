import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!

// Delay entre transacciones para no saturar la API
const DELAY_MS = 2000 // 2 segundos para evitar rate limiting
const NUM_TRANSACTIONS = 50

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function seedTransactionsBlockchain() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('Conectado a MongoDB\n')

    const db = client.db('starsblocks')

    // Obtener usuarios con wallet
    const users = await db.collection('users').find({ wallet: { $exists: true, $ne: null } }).toArray()
    console.log(`Usuarios con wallet: ${users.length}`)

    // Obtener collectors
    const collectors = await db.collection('collectors').find({}).toArray()
    console.log(`Collectors: ${collectors.length}`)

    // Obtener productos
    const products = await db.collection('productTypes').find({}).toArray()
    console.log(`Productos: ${products.map(p => p.name).join(', ')}`)

    if (users.length === 0 || collectors.length === 0 || products.length === 0) {
      console.error('Faltan datos. Ejecuta reset-and-seed.ts primero.')
      return
    }

    // Contar transacciones existentes para retomar
    const existingCount = await db.collection('transactions').countDocuments()
    console.log(`\nTransacciones existentes: ${existingCount}`)

    const remaining = NUM_TRANSACTIONS - existingCount
    if (remaining <= 0) {
      console.log(`Ya hay ${existingCount} transacciones. Meta alcanzada.`)
      return
    }

    // Crear transacciones reales via endpoint
    console.log('\n=== CREANDO TRANSACCIONES EN BLOCKCHAIN ===')
    console.log(`URL base: ${BASE_URL}`)
    console.log(`Creando ${remaining} transacciones (retomando desde ${existingCount})...`)
    console.log(`Delay: ${DELAY_MS}ms entre cada una\n`)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < remaining; i++) {
      const totalIndex = existingCount + i + 1
      const user = users[Math.floor(Math.random() * users.length)]
      const collector = collectors[Math.floor(Math.random() * collectors.length)]
      const product = products[Math.floor(Math.random() * products.length)]
      const amount = Math.round((Math.random() * 20 + 0.5) * 10) / 10 // 0.5 a 20.5 kg

      try {
        const response = await fetch(`${BASE_URL}/api/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': INTERNAL_API_KEY
          },
          body: JSON.stringify({
            userWallet: user.wallet,
            collectorId: collector._id.toString(),
            productTypeId: product._id.toString(),
            amount
          })
        })

        if (response.ok) {
          const data = await response.json()
          successCount++
          console.log(`[${totalIndex}/${NUM_TRANSACTIONS}] OK - ${user.name} | ${product.name} | ${amount}kg | txHash: ${data.txHash?.substring(0, 16)}...`)
        } else {
          const error = await response.json()
          errorCount++
          console.log(`[${totalIndex}/${NUM_TRANSACTIONS}] ERROR - ${error.error}`)
        }
      } catch (err) {
        errorCount++
        console.log(`[${totalIndex}/${NUM_TRANSACTIONS}] ERROR - ${err instanceof Error ? err.message : 'Unknown error'}`)
      }

      // Delay para no saturar
      if (i < remaining - 1) {
        await sleep(DELAY_MS)
      }
    }

    console.log('\n=== RESUMEN ===')
    console.log(`Transacciones exitosas: ${successCount}`)
    console.log(`Transacciones fallidas: ${errorCount}`)

    // Verificar en DB
    const finalCount = await db.collection('transactions').countDocuments()
    console.log(`Total en base de datos: ${finalCount}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

seedTransactionsBlockchain()
