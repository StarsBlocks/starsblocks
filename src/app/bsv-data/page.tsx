'use client'

import { useState } from 'react'

export default function BsvDataPage() {
  const [data, setData] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; txid?: string; message?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/bsv/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error || 'Failed to write data')
      }

      setResult(json)
      setData('') // Clear input on success
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-heading">
          <h1>BSV Data Writer</h1>
          <p>Immute data on the Bitcoin SV blockchain</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="data" className="auth-label">
              Data to Inscribe
            </label>
            <textarea
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="auth-input"
              rows={4}
              placeholder="Enter text to store on-chain..."
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          {result && result.success && (
            <div style={{ 
              background: 'rgba(74, 222, 128, 0.15)', 
              border: '1px solid rgba(74, 222, 128, 0.45)', 
              color: '#4ade80', 
              borderRadius: '16px', 
              padding: '0.85rem 1rem',
              wordBreak: 'break-all'
            }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 'bold' }}>Success!</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>TXID: {result.txid}</p>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Writing to Blockchain...' : 'Write to Blockchain'}
          </button>
        </form>
      </div>
    </div>
  )
}
