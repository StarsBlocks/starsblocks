/**
 * Migration script to calculate and update pointsEarned for existing transactions
 * Run with: npx tsx scripts/migrate-points.ts
 */

import { config } from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'

// Load environment variables
config()

const MONGODB_URI = process.env.MONGODB_URI || ''

async function migratePoints() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✓ Connected to MongoDB')

    const db = client.db('starsblocks')
    console.log(`Database name: ${db.databaseName}`)

    // Check total transactions
    const totalCount = await db.collection('transactions').countDocuments()
    console.log(`Total transactions in database: ${totalCount}`)

    // Get a sample transaction
    const sample = await db.collection('transactions').findOne({})
    console.log('Sample transaction:', JSON.stringify(sample, null, 2))

    // Get ALL transactions to recalculate points
    const transactionsToUpdate = await db.collection('transactions')
      .find({})
      .toArray()

    console.log(`Found ${transactionsToUpdate.length} transactions to update`)

    let updated = 0
    let errors = 0

    for (const transaction of transactionsToUpdate) {
      try {
        // Get the product type
        const productType = await db.collection('productTypes').findOne({
          _id: new ObjectId(transaction.productTypeId)
        })

        if (!productType) {
          console.warn(`⚠ Product type not found for transaction ${transaction._id}`)
          errors++
          continue
        }

        // Calculate points
        const pointsEarned = transaction.amount * productType.pricePerKg

        // Update transaction
        await db.collection('transactions').updateOne(
          { _id: transaction._id },
          { $set: { pointsEarned } }
        )

        console.log(`✓ Updated transaction ${transaction._id}: ${transaction.amount}kg × ${productType.pricePerKg} = ${pointsEarned} points`)
        updated++

      } catch (error) {
        console.error(`✗ Error updating transaction ${transaction._id}:`, error)
        errors++
      }
    }

    console.log('\n=== Migration Summary ===')
    console.log(`Total transactions found: ${transactionsToUpdate.length}`)
    console.log(`Successfully updated: ${updated}`)
    console.log(`Errors: ${errors}`)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await client.close()
    console.log('✓ Database connection closed')
  }
}

// Run migration
migratePoints()
  .then(() => {
    console.log('\n✓ Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error)
    process.exit(1)
  })
