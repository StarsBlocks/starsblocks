import { PrivateKey, KeyDeriver, WalletInterface } from '@bsv/sdk'
import { Wallet, WalletStorageManager, WalletSigner, Services, StorageClient, Chain } from '@bsv/wallet-toolbox'

// Initialize wallet configuration
const privateKeyHex = process.env.PRIVATE_KEY
const storageUrl = process.env.STORAGE_URL || 'https://storage.babbage.systems'
const network = (process.env.NETWORK || 'main') as Chain

if (!privateKeyHex) {
  console.warn('PRIVATE_KEY not found in .env')
}

let walletInstance: WalletInterface | null = null

// Initialize wallet asynchronously
async function initializeWallet() {
  if (!privateKeyHex) {
    throw new Error('PRIVATE_KEY not found in .env')
  }

  try {
    const privateKey = PrivateKey.fromHex(privateKeyHex)
    const keyDeriver = new KeyDeriver(privateKey)
    const storageManager = new WalletStorageManager(keyDeriver.identityKey)
    const signer = new WalletSigner(network, keyDeriver, storageManager)
    const services = new Services(network)
    walletInstance = new Wallet(signer, services)

    // Setup storage
    const client = new StorageClient(walletInstance, storageUrl)
    await client.makeAvailable()
    await storageManager.addWalletStorageProvider(client)

    console.log('✓ Backend wallet initialized')
    console.log(`✓ Identity: ${keyDeriver.identityKey}`)
    
    return walletInstance
  } catch (error) {
    console.error('Failed to initialize wallet:', error)
    throw error
  }
}

// Get or initialize wallet
async function getWallet(): Promise<WalletInterface> {
  if (!walletInstance) {
    await initializeWallet()
  }
  if (!walletInstance) {
    throw new Error('Wallet initialization failed')
  }
  return walletInstance
}

export const wallet = {
  getPublicKey: async (options?: { identityKey?: true }) => {
    const w = await getWallet()
    const pubKey = await w.getPublicKey(options || {})
    return {
      publicKey: pubKey
    }
  },
  createAction: async (params: {
    description: string
    outputs: {
      lockingScript: string
      satoshis: number
      outputDescription: string
    }[]
    options?: {
      randomizeOutputs?: boolean
    }
  }) => {
    const w = await getWallet()
    const result = await w.createAction(params)
    return result
  }
}
