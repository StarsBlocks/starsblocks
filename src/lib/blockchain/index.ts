import { wallet } from '@/lib/wallet'
import { Script, Utils, WalletInterface } from '@bsv/sdk'
import { NextResponse } from 'next/server'
import { PrivateKey, PublicKey, KeyDeriver } from '@bsv/sdk'
import { Wallet, WalletStorageManager, WalletSigner, Services, StorageClient, Chain } from '@bsv/wallet-toolbox'

const NETWORK = (process.env.NETWORK || 'main') as Chain
const STORAGE_URL = process.env.STORAGE_URL || 'https://storage.babbage.systems'

export interface WasteRegistrationData {
  user: string
  collector_id: string
  product_type: string
  amount: number
  points: number
}

export interface BlockchainWriteResult {
  success: boolean
  txid: string
  tx?: unknown
}

/**
 * Escribe datos en la blockchain BSV usando OP_RETURN
 */
export async function writeToBlockchain(data: string): Promise<BlockchainWriteResult> {
  if (!data || typeof data !== 'string') {
    throw new Error('Missing or invalid data parameter')
  }

  const lockingScript = Script.fromASM(
    `OP_FALSE OP_RETURN ${Utils.toHex(Utils.toArray(data, 'utf8'))}`
  )

  const result = await wallet.createAction({
    description: `Write data: ${data}`,
    outputs: [
      {
        lockingScript: lockingScript.toHex(),
        satoshis: 0,
        outputDescription: 'Data inscription'
      }
    ],
    options: {
      randomizeOutputs: false
    }
  })

  return {
    success: true,
    txid: result?.txid || 'unknown',
    tx: result.tx
  }
}

/**
 * Registra una transacción de reciclaje en la blockchain
 */
export async function registerWasteOnChain(data: WasteRegistrationData): Promise<string> {
  const jsonData = JSON.stringify(data)
  const result = await writeToBlockchain(jsonData)
  return result.txid
}

export async function verifyTransaction(txHash: string): Promise<boolean> {
  // TODO: Verificar transacción en blockchain
  console.log('Verificando tx:', txHash)
  return true
}

export async function createWallet(): Promise<WalletInterface> {
  try {
    // Generate a new random private key
    const privateKey = PrivateKey.fromRandom()
    const publicKey = privateKey.toPublicKey()
    const address = publicKey.toAddress()

    // Initialize wallet components
    const keyDeriver = new KeyDeriver(privateKey)
    const storageManager = new WalletStorageManager(keyDeriver.identityKey)
    const signer = new WalletSigner(NETWORK, keyDeriver, storageManager)
    const services = new Services(NETWORK)
    const wallet = new Wallet(signer, services)
    
    // Connect to storage
    const client = new StorageClient(wallet, STORAGE_URL)
    await client.makeAvailable()
    await storageManager.addWalletStorageProvider(client)

    // Return the created wallet
    return wallet

  } catch (error: any) {
    console.error('Create Wallet Error:', error)
    throw error
  }
}