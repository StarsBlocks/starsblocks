import { NextResponse } from 'next/server'
import { wallet } from '@/lib/wallet'
import { Script, Utils } from '@bsv/sdk'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data || typeof data !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid data parameter' }, { status: 400 })
    }

    // Create the OP_RETURN script
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

    return NextResponse.json({
      success: true,
      message: 'Data sent to blockchain!',
      txid: result?.txid || 'unknown',
      tx: result.tx
    })

  } catch (error: any) {
    console.error('BSV Write Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to write data' }, { status: 500 })
  }
}
