import { wallet } from '@/lib/wallet'
import { Script, Utils, PrivateKey } from '@bsv/sdk'

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

export interface WalletKeys {
  publicKey: string
  privateKey: string
  address: string
}

export async function createWallet(): Promise<WalletKeys> {
  try {
    // Generate a new random private key
    const privateKey = PrivateKey.fromRandom()
    const publicKey = privateKey.toPublicKey()
    const address = publicKey.toAddress()

    // Log wallet info for debugging
    console.log('=== New Wallet Created ===')
    console.log('Private Key:', privateKey.toHex())
    console.log('Public Key:', publicKey.toString())
    console.log('Address:', address)
    console.log('==========================')

    // Return keys as object
    return {
      publicKey: publicKey.toString(),
      privateKey: privateKey.toHex(),
      address: String(address)
    }

  } catch (error: any) {
    console.error('Create Wallet Error:', error)
    throw error
  }
}